//eventHandlers.js

import UIkit from 'uikit';
import { showPreloader } from '../utils/preloader.js';
import { initializePlayer } from '../player/initializePlayer.js';
import { fetchPages } from './fetch-pages.js'; 

// attach event listeners to off-canvas links
export function attachOffcanvasListeners() {
  document.querySelectorAll('.offcanvas-link').forEach(function(link) {
    link.addEventListener('click', function() {
      UIkit.offcanvas('#offcanvas-nav').hide();
    });
  });
}

// DOMContentLoaded => initi player => fetch pages => attach off-canvas listeners => displays content
export function handleDOMContentLoaded() {
  showPreloader()
    .then(() => {
      initializePlayer();
      return fetchPages();
    })
    .then(() => {
      attachOffcanvasListeners();
      const content = document.getElementById('content');
      if (content) {
        content.style.display = 'block';
      }
    });
}
