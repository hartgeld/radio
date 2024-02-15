// src/index.js
import 'uikit/dist/css/uikit.min.css';
import '@fortawesome/fontawesome-free/js/all';
import UIkit from 'uikit';
import { initializePlayer } from './player';
import { fetch_player_metaInfo } from './player_meta-info.js';
import { fetchPages } from './fetch-pages.js';

// Configure lazysizes
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.expand = 100; // set to your desired value

import 'lazysizes';

// Function to attach event listeners
function attachOffcanvasListeners() {
  document.querySelectorAll('.offcanvas-link').forEach(function(link) {
    link.addEventListener('click', function() {
      console.log("close offcanvas-nav");
      UIkit.offcanvas('#offcanvas-nav').hide();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {   
  document.body.style.display = 'block'; // Show the body
  initializePlayer();
  fetchPages(); 

  // Attach event listeners
  attachOffcanvasListeners();

  // Hide the preloader
  var preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  } 
});

setInterval(fetch_player_metaInfo, 5000);