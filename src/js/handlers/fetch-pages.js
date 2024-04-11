// fetch-pages.js
import UIkit from 'uikit';
import { attachEventListener } from './content-handler.js';
import { showPreloader, hidePreloader } from '../utils/preloader.js';

// new
import { fetchAndRenderContent } from './fetch-render.js';

let eventListenersAttached = false;

// fetch pages and attach event listeners
export function fetchPages() {
  return new Promise((resolve, reject) => {
    if (eventListenersAttached) {
      resolve();
    } else {
      // Attach click event listener to navigation container
      attachEventListener('.uk-navbar-container');
      attachEventListener('.show-page');
      // Attach click event listener to off-canvas sidebar when it's shown
      UIkit.util.on('#offcanvas-nav', 'shown', handleShownOffcanvasNav);
      UIkit.util.on('#offcanvas-nav', 'hidden', handleHiddenOffcanvasNav);
      // Attach popstate event listener
      window.addEventListener('popstate', handlePopState);
      // event listeners are attached
      eventListenersAttached = true;
      resolve();
    }
  });
}

// Attach event listener to off-canvas navigation
function handleShownOffcanvasNav() {
  attachEventListener('#offcanvas-nav');
}

// handle 'hidden' event of off-canvas sidebar
function handleHiddenOffcanvasNav() {
  // Get the URL without the fragment
  const urlWithoutFragment = window.location.href.split('#')[0];
  // Replace the current URL with the original URL without the fragment
  history.replaceState({}, '', urlWithoutFragment);
}

// handle 'popstate' event
function handlePopState(event) {
  showPreloader()
    .then(() => fetchAndRenderContent(window.location.href))
    .then(hidePreloader);
}