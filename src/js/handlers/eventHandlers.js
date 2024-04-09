//eventHandlers.js

import UIkit from 'uikit';
import { showPreloader } from '../utils/preloader.js';
import { initializePlayer } from '../player/initializePlayer.js';
import { fetchPages } from './fetch-pages.js';


// function to attach event listeners
export function attachOffcanvasListeners() {
  document.querySelectorAll('.offcanvas-link').forEach(function(link) {
    link.addEventListener('click', function() {
      console.log("close offcanvas-nav");
      UIkit.offcanvas('#offcanvas-nav').hide();
    });
  });
}

export function handleDOMContentLoaded() {
  showPreloader()
    .then(() => {
      initializePlayer();
      return fetchPages();
    })
    .then(() => {
      attachOffcanvasListeners();
      var content = document.getElementById('content');
      if (content) {
        content.style.display = 'block';
      }
    });
}