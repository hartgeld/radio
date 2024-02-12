// src/index.js
import 'uikit/dist/css/uikit.min.css';
import '@fortawesome/fontawesome-free/js/all';
import { Howl } from 'howler';
import UIkit from 'uikit';
import { initializePlayer } from './player';
import { fetch_player_metaInfo } from './player_meta-info.js';
import { fetchPages } from './fetch-pages.js';


document.addEventListener('DOMContentLoaded', function() {
   
  document.body.style.display = 'block'; // Show the body
  initializePlayer();
  fetchPages(); 
  // Hide the preloader
  document.getElementById('preloader').style.display = 'none';
 
});

setInterval(fetch_player_metaInfo, 5000);