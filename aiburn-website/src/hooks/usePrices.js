import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for loading and managing AI model prices
 * Automatically detects stale prices and provides refresh functionality
 */
export function usePrices() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Check if prices are stale (> 7 days old)
  const checkIfStale = useCallback((timestamp) => {
    const lastUpdateTime = new Date(timestamp).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return now - lastUpdateTime > sevenDaysMs;
  }, []);

  // Load prices from JSON file
  const loadPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/data/prices.json');

      if (!response.ok) {
        throw new Error(`Failed to load prices: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data structure
      if (!data.models || Object.keys(data.models).length === 0) {
        throw new Error('Invalid price data structure');
      }

      setPrices(data);
      setLastUpdated(new Date(data.timestamp));
      setIsStale(checkIfStale(data.timestamp));

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error loading prices:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkIfStale]);

  // Format timestamp for display
  const formatTimestamp = useCallback((date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Get age of prices in days
  const getPriceAge = useCallback(() => {
    if (!lastUpdated) return null;
    const now = Date.now();
    const ageMs = now - lastUpdated.getTime();
    const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
    return ageDays;
  }, [lastUpdated]);

  // Convert prices from file to calculator format
  const getCalculatorModels = useCallback(() => {
    if (!prices || !prices.models) return null;

    const models = {};
    Object.entries(prices.models).forEach(([modelName, priceData]) => {
      models[modelName] = {
        input: priceData.input,
        output: priceData.output,
        provider: priceData.provider,
        category: getCategoryForModel(modelName),
      };
    });
    return models;
  }, [prices]);

  // Get category for a model (for UI display)
  const getCategoryForModel = (modelName) => {
    const categoryMap = {
      'GPT-4': 'Premium',
      'GPT-4 Turbo': 'Standard',
      'GPT-4o': 'Balanced',
      'GPT-3.5 Turbo': 'Budget',
      'Claude 3 Opus': 'Premium',
      'Claude 3.5 Sonnet': 'Standard',
      'Claude 3 Haiku': 'Budget',
      'Llama 3.1 70B': 'Budget',
      'DeepSeek Chat': 'Budget',
    };
    return categoryMap[modelName] || 'Standard';
  };

  // Load prices on component mount
  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    isStale,
    refresh: loadPrices,
    formatTimestamp,
    getPriceAge,
    getCalculatorModels,
  };
}
