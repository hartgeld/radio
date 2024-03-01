// import font awesome icons
import '@fortawesome/fontawesome-free/js/all';

// import typeface inter
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

// import uikit
import UIkit from 'uikit';

// import custom css
import './styles.scss';

// import custom js
import { initializePlayer } from './player';
import { fetch_player_metaInfo } from './player_meta-info.js';
import { fetchPages } from './fetch-pages.js';

// configure and import lazysizes
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.expand = 100; // set to your desired value
import 'lazysizes';

// function to attach event listeners
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