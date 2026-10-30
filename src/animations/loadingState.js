/**
 * Animation: Loading State
 * Built-in accessible loading spinner and busy state management
 */

import { createElement } from '../utils/dom.js';

export const loadingState = {
  name: 'loading-state',
  aliases: ['loading', 'loadingState', 'loadingstate'],
  className: 'bc-anim-loading-state',
  setup(element, options, cleanup) {
    let spinner = null;
    const originalDisabled = element.disabled;
    const originalAriaBusy = element.getAttribute('aria-busy');
    const originalAriaLabel = element.getAttribute('aria-label');

    const setStatus = (isLoading, text) => {
      if (isLoading) {
        element.disabled = true;
        element.setAttribute('aria-busy', 'true');
        if (text) {
          element.setAttribute('aria-label', text);
        }

        if (!spinner) {
          spinner = createElement('span', 'bc-spinner', { 'aria-hidden': 'true' });
          element.prepend(spinner);
        }
      } else {
        if (spinner) {
          spinner.remove();
          spinner = null;
        }
        element.disabled = originalDisabled;
        if (originalAriaBusy === null) {
          element.removeAttribute('aria-busy');
        } else {
          element.setAttribute('aria-busy', originalAriaBusy);
        }
        if (originalAriaLabel === null) {
          element.removeAttribute('aria-label');
        } else {
          element.setAttribute('aria-label', originalAriaLabel);
        }
      }
    };

    if (options.loading || options.isLoading) {
      setStatus(true, options.loadingText || options.text);
    }

    cleanup.add(() => {
      setStatus(false);
    });

    return () => {
      setStatus(false);
    };
  }
};
