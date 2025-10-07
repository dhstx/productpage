import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }

    // Custom event tracking for key actions
    const trackEvent = (category, action, label) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
        });
      }
    };

    // Track page views
    trackEvent('Page View', 'view', location.pathname);

    // Add event listeners for button clicks
    const buttons = document.querySelectorAll('.btn-system, .btn-system-outline');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const text = e.target.textContent || e.target.innerText;
        trackEvent('Button Click', 'click', text);
      });
    });

    return () => {
      // Cleanup event listeners
      buttons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
    };
  }, [location]);

  return null; // This component doesn't render anything
}

// Google Analytics script to add to index.html:
/*
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
*/
