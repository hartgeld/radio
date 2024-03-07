// import font awesome icons
import '@fortawesome/fontawesome-free/js/all';

// import typeface inter
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// import uikit
import UIkit from 'uikit';

// import custom css
import './styles.scss';

// import custom js
import { initializePlayer } from './player';
import { fetch_player_metaInfo } from './player_meta-info.js';
import { fetchPages } from './fetch-pages.js';
import { showPreloader, hidePreloader } from './preloader.js';


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
  showPreloader()
    .then(() => {
      initializePlayer();
      return fetchPages();
    })
    .then(() => {
      // Attach event listeners
      attachOffcanvasListeners();
      // Show the "content" div
      var content = document.getElementById('content');
      if (content) {
        content.style.display = 'block';
      }
      // Hide the preloader after a delay
      setTimeout(() => {
        var preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.style.display = 'none';
        }
      }, 500); // Adjust this value as needed
    });
});


setInterval(fetch_player_metaInfo, 5000);