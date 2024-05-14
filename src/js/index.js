// index.js
// Import libraries
import '@fortawesome/fontawesome-free/js/all';

// Import fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import custom CSS
import '../styles/styles.scss';

// Import custom JS 
import { handleOnLoad } from './utils/preloader.js';
import { handleDOMContentLoaded } from './handlers/eventHandlers.js';
import './config/lazySizesConfig.js'; 
import { fetch_player_metaInfo } from './player/player_meta-info.js';
//import './handlers/tagFilter.js';

// Event listeners
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
window.onload = handleOnLoad;

// Periodic tasks
setInterval(fetch_player_metaInfo, 5000); 



