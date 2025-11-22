/**
 * UI Component Tests
 * Tests UI rendering, interactions, and responsive design
 */

describe('UI Component Tests', () => {
  describe('Ad Card Component', () => {
    const renderAdCard = (slot) => {
      return {
        id: slot.id,
        name: slot.name,
        price: slot.price,
        isAvailable: !slot.sponsor,
      }
    }

    it('should render available ad slot', () => {
      const slot = {
        id: 'test-1',
        name: 'Test Ad',
        price: 499,
        color: 'from-slate-200 to-slate-300',
      }

      const rendered = renderAdCard(slot)
      expect(rendered.isAvailable).toBe(true)
      expect(rendered.name).toBe('Test Ad')
    })

    it('should show unavailable for sponsored slots', () => {
      const slot = {
        id: 'test-1',
        name: 'Test Ad',
        price: 499,
        sponsor: { name: 'Company X', url: 'https://example.com' },
      }

      const rendered = renderAdCard(slot)
      expect(rendered.isAvailable).toBe(false)
    })

    it('should render ad price correctly', () => {
      const slot = { id: 'test-1', name: 'Test', price: 1499 }
      const rendered = renderAdCard(slot)
      expect(rendered.price).toBe(1499)
      expect(typeof rendered.price).toBe('number')
    })

    it('should handle missing sponsor data', () => {
      const slot = { id: 'test-1', name: 'Test', price: 499 }
      const rendered = renderAdCard(slot)
      expect(rendered.isAvailable).toBe(true)
    })
  })

  describe('Results Display', () => {
    const formatCurrency = (value) => {
      return `$${parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }

    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should format small amounts', () => {
      expect(formatCurrency(0.01)).toBe('$0.01')
      expect(formatCurrency(0.99)).toBe('$0.99')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle string input', () => {
      expect(formatCurrency('100')).toBe('$100.00')
      expect(formatCurrency('1000.5')).toBe('$1,000.50')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(999999999)).toBe('$999,999,999.00')
    })
  })

  describe('Alternative Models Display', () => {
    const sortAlternativesByCategory = (alternatives) => {
      const categories = {
        'Premium': [],
        'Standard': [],
        'Balanced': [],
        'Budget': [],
      }

      alternatives.forEach((alt) => {
        const category = alt.category || 'Budget'
        if (categories[category]) {
          categories[category].push(alt)
        }
      })

      return categories
    }

    it('should categorize alternatives', () => {
      const alternatives = [
        { name: 'GPT-4', category: 'Premium' },
        { name: 'GPT-4o', category: 'Balanced' },
        { name: 'Llama', category: 'Budget' },
      ]

      const grouped = sortAlternativesByCategory(alternatives)
      expect(grouped.Premium.length).toBe(1)
      expect(grouped.Balanced.length).toBe(1)
      expect(grouped.Budget.length).toBe(1)
    })

    it('should handle missing category', () => {
      const alternatives = [{ name: 'Unknown Model' }]
      const grouped = sortAlternativesByCategory(alternatives)
      expect(grouped.Budget.length).toBe(1)
    })

    it('should preserve all items', () => {
      const alternatives = [
        { name: 'Model1', category: 'Premium' },
        { name: 'Model2', category: 'Budget' },
        { name: 'Model3', category: 'Standard' },
      ]

      const grouped = sortAlternativesByCategory(alternatives)
      const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)
      expect(total).toBe(3)
    })
  })

  describe('Button States', () => {
    const isButtonDisabled = (state) => {
      return state.loading || !state.isValid
    }

    it('should disable button when loading', () => {
      expect(isButtonDisabled({ loading: true, isValid: true })).toBe(true)
    })

    it('should disable button when invalid', () => {
      expect(isButtonDisabled({ loading: false, isValid: false })).toBe(true)
    })

    it('should enable button when valid and not loading', () => {
      expect(isButtonDisabled({ loading: false, isValid: true })).toBe(false)
    })

    it('should disable button when both loading and invalid', () => {
      expect(isButtonDisabled({ loading: true, isValid: false })).toBe(true)
    })
  })

  describe('Error Display', () => {
    const getErrorClass = (error) => {
      if (!error) return 'hidden'
      if (error.includes('API')) return 'bg-red-100 text-red-800'
      if (error.includes('network')) return 'bg-orange-100 text-orange-800'
      return 'bg-red-100 text-red-800'
    }

    it('should hide error when none present', () => {
      expect(getErrorClass(null)).toBe('hidden')
      expect(getErrorClass('')).toBe('hidden')
    })

    it('should highlight API errors', () => {
      expect(getErrorClass('API key is invalid')).toContain('red')
    })

    it('should highlight network errors', () => {
      expect(getErrorClass('network connection failed')).toContain('orange')
    })

    it('should use default for unknown errors', () => {
      expect(getErrorClass('Something went wrong')).toContain('red')
    })
  })

  describe('Loading State', () => {
    const getLoadingMessage = (mode) => {
      switch (mode) {
        case 'quick':
          return 'Calculating costs...'
        case 'exact':
          return 'Fetching your usage...'
        default:
          return 'Loading...'
      }
    }

    it('should show quick calc loading', () => {
      expect(getLoadingMessage('quick')).toBe('Calculating costs...')
    })

    it('should show exact mode loading', () => {
      expect(getLoadingMessage('exact')).toBe('Fetching your usage...')
    })

    it('should show default loading', () => {
      expect(getLoadingMessage('unknown')).toBe('Loading...')
    })

    it('should handle null mode', () => {
      expect(getLoadingMessage(null)).toBe('Loading...')
    })
  })

  describe('Tab Navigation', () => {
    const handleTabChange = (newTab, currentTab) => {
      if (newTab === currentTab) return currentTab
      if (['quick', 'exact'].includes(newTab)) return newTab
      return currentTab
    }

    it('should change tabs', () => {
      expect(handleTabChange('exact', 'quick')).toBe('exact')
      expect(handleTabChange('quick', 'exact')).toBe('quick')
    })

    it('should not change to invalid tab', () => {
      expect(handleTabChange('invalid', 'quick')).toBe('quick')
    })

    it('should keep same tab when unchanged', () => {
      expect(handleTabChange('quick', 'quick')).toBe('quick')
    })

    it('should only accept known tabs', () => {
      expect(handleTabChange('spam', 'exact')).toBe('exact')
      expect(handleTabChange('', 'quick')).toBe('quick')
    })
  })
})

describe('Responsive Design', () => {
  describe('Layout Breakpoints', () => {
    const getLayoutClass = (screenWidth) => {
      if (screenWidth < 768) return 'mobile'
      if (screenWidth < 1024) return 'tablet'
      return 'desktop'
    }

    it('should use mobile layout for small screens', () => {
      expect(getLayoutClass(320)).toBe('mobile')
      expect(getLayoutClass(480)).toBe('mobile')
      expect(getLayoutClass(767)).toBe('mobile')
    })

    it('should use tablet layout for medium screens', () => {
      expect(getLayoutClass(768)).toBe('tablet')
      expect(getLayoutClass(800)).toBe('tablet')
      expect(getLayoutClass(1023)).toBe('tablet')
    })

    it('should use desktop layout for large screens', () => {
      expect(getLayoutClass(1024)).toBe('desktop')
      expect(getLayoutClass(1440)).toBe('desktop')
      expect(getLayoutClass(1920)).toBe('desktop')
    })

    it('should handle boundary values', () => {
      expect(getLayoutClass(768)).toBe('tablet')
      expect(getLayoutClass(1024)).toBe('desktop')
    })
  })

  describe('Grid Layout', () => {
    const getGridColumns = (screenWidth) => {
      if (screenWidth < 768) return 1
      if (screenWidth < 1200) return 2
      return 5 // 20-60-20 layout
    }

    it('should use single column on mobile', () => {
      expect(getGridColumns(480)).toBe(1)
    })

    it('should use 2 columns on tablet', () => {
      expect(getGridColumns(800)).toBe(2)
    })

    it('should use 5 columns on desktop (20-60-20)', () => {
      expect(getGridColumns(1400)).toBe(5)
    })
  })

  describe('Ad Visibility', () => {
    const shouldShowAd = (adPlacement, screenWidth) => {
      const hiddenOnMobile = ['sidebar', 'featured']

      if (screenWidth < 768 && hiddenOnMobile.includes(adPlacement)) {
        return false
      }

      return true
    }

    it('should show header ads on all devices', () => {
      expect(shouldShowAd('header', 320)).toBe(true)
      expect(shouldShowAd('header', 1440)).toBe(true)
    })

    it('should hide sidebar ads on mobile', () => {
      expect(shouldShowAd('sidebar', 320)).toBe(false)
      expect(shouldShowAd('sidebar', 1440)).toBe(true)
    })

    it('should hide featured ads on mobile', () => {
      expect(shouldShowAd('featured', 480)).toBe(false)
      expect(shouldShowAd('featured', 768)).toBe(true)
    })

    it('should show footer ads on all devices', () => {
      expect(shouldShowAd('footer', 320)).toBe(true)
      expect(shouldShowAd('footer', 1440)).toBe(true)
    })
  })

  describe('Font Scaling', () => {
    const getFontSize = (element, screenWidth) => {
      const sizes = {
        'h1': { mobile: 24, tablet: 32, desktop: 48 },
        'h2': { mobile: 18, tablet: 24, desktop: 32 },
        'p': { mobile: 14, tablet: 16, desktop: 16 },
      }

      const elementSizes = sizes[element] || sizes.p
      if (screenWidth < 768) return elementSizes.mobile
      if (screenWidth < 1024) return elementSizes.tablet
      return elementSizes.desktop
    }

    it('should scale h1 for different screens', () => {
      expect(getFontSize('h1', 480)).toBe(24)
      expect(getFontSize('h1', 768)).toBe(32)
      expect(getFontSize('h1', 1440)).toBe(48)
    })

    it('should scale h2 for different screens', () => {
      expect(getFontSize('h2', 480)).toBe(18)
      expect(getFontSize('h2', 768)).toBe(24)
      expect(getFontSize('h2', 1440)).toBe(32)
    })

    it('should keep paragraph text consistent', () => {
      expect(getFontSize('p', 480)).toBe(14)
      expect(getFontSize('p', 1440)).toBe(16)
    })
  })

  describe('Spacing Adjustments', () => {
    const getPadding = (screenWidth) => {
      if (screenWidth < 768) return '16px'
      if (screenWidth < 1024) return '24px'
      return '32px'
    }

    it('should use smaller padding on mobile', () => {
      expect(getPadding(480)).toBe('16px')
    })

    it('should increase padding on tablet', () => {
      expect(getPadding(800)).toBe('24px')
    })

    it('should use largest padding on desktop', () => {
      expect(getPadding(1440)).toBe('32px')
    })
  })

  describe('Touch Target Size', () => {
    const isTouchTargetSize = (width, height) => {
      // Minimum 44x44 for touch targets
      return width >= 44 && height >= 44
    }

    it('should validate proper touch target', () => {
      expect(isTouchTargetSize(44, 44)).toBe(true)
      expect(isTouchTargetSize(50, 50)).toBe(true)
    })

    it('should reject too small targets', () => {
      expect(isTouchTargetSize(40, 40)).toBe(false)
      expect(isTouchTargetSize(20, 44)).toBe(false)
    })

    it('should accept larger targets', () => {
      expect(isTouchTargetSize(100, 100)).toBe(true)
    })
  })
})

describe('Ad Placement & Visibility', () => {
  describe('Ad Slot Configuration', () => {
    const validateAdSlot = (slot) => {
      const required = ['id', 'name', 'price', 'placement']
      const missing = required.filter((key) => !slot[key])

      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`)
      }

      if (slot.price < 0) {
        throw new Error('Price cannot be negative')
      }

      const validPlacements = ['full-width-top', 'sidebar', 'footer', 'content-inline']
      if (!validPlacements.includes(slot.placement)) {
        throw new Error(`Invalid placement: ${slot.placement}`)
      }

      return true
    }

    it('should validate complete ad slot', () => {
      const slot = {
        id: 'test-1',
        name: 'Test Ad',
        price: 499,
        placement: 'sidebar',
      }
      expect(validateAdSlot(slot)).toBe(true)
    })

    it('should reject incomplete ad slot', () => {
      const slot = { id: 'test-1', name: 'Test Ad' }
      expect(() => validateAdSlot(slot)).toThrow('Missing required fields')
    })

    it('should reject negative prices', () => {
      const slot = {
        id: 'test-1',
        name: 'Test Ad',
        price: -499,
        placement: 'sidebar',
      }
      expect(() => validateAdSlot(slot)).toThrow('Price cannot be negative')
    })

    it('should reject invalid placement', () => {
      const slot = {
        id: 'test-1',
        name: 'Test Ad',
        price: 499,
        placement: 'invalid-spot',
      }
      expect(() => validateAdSlot(slot)).toThrow('Invalid placement')
    })
  })

  describe('Ad Rotation', () => {
    const rotateAdSlot = (slots, currentIndex) => {
      const nextIndex = (currentIndex + 1) % slots.length
      return { nextIndex, slot: slots[nextIndex] }
    }

    it('should rotate to next ad', () => {
      const slots = [
        { id: '1', name: 'Ad 1' },
        { id: '2', name: 'Ad 2' },
        { id: '3', name: 'Ad 3' },
      ]

      let current = 0
      const result = rotateAdSlot(slots, current)
      expect(result.nextIndex).toBe(1)
    })

    it('should loop back to start', () => {
      const slots = [
        { id: '1', name: 'Ad 1' },
        { id: '2', name: 'Ad 2' },
      ]

      const result = rotateAdSlot(slots, 1)
      expect(result.nextIndex).toBe(0)
    })

    it('should handle single ad', () => {
      const slots = [{ id: '1', name: 'Ad 1' }]
      const result = rotateAdSlot(slots, 0)
      expect(result.nextIndex).toBe(0)
    })
  })
})
