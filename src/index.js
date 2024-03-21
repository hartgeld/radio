// Import libraries
import '@fortawesome/fontawesome-free/js/all';

// Import fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import custom CSS
import './styles.scss';

// Import custom JS 
import { handleOnLoad } from './preloader.js';
import { handleDOMContentLoaded } from './eventHandlers.js';
import './lazySizesConfig.js'; 
import { fetch_player_metaInfo } from './player_meta-info.js';

// Event listeners
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
window.onload = handleOnLoad;

// Periodic tasks
setInterval(fetch_player_metaInfo, 5000); 

//backupzzz
//import { initializePlayer } from './player';
//import { fetchPages } from './fetch-pages.js';
//import UIkit from 'uikit'; // UIKit
