/**
 * Google Analytics initialization
 * 
 * Dynamically loads GA script to avoid CSP violations
 * Called from main.jsx
 */

export function initializeGA() {
  // Create script tag for GA
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FPK0Y02B8F';
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-FPK0Y02B8F', {
    page_path: window.location.pathname,
    send_page_view: true,
  });
}
