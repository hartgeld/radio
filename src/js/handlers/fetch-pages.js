
// fetch-pages.js
/*
import UIkit from 'uikit';
import { showPreloader, hidePreloader } from '../utils/preloader';
import { fetchAndRenderContent, attachEventListener } from './content-handler';
import { fetchAndRenderContentForPopState } from './fetch-render';

// rest of the code...
let eventListenersAttached = false;

function handleShownOffcanvasNav() {
  console.log("adding event listener to offcanvas-nav");
  attachEventListener('#offcanvas-nav');
}

function handleHiddenOffcanvasNav() {
  console.log('Current URL:', window.location.href);
  // Get the URL without the fragment
  var urlWithoutFragment = window.location.href.split('#')[0];
  console.log('URL without fragment:', urlWithoutFragment);

  // Replace the current URL with the original URL without the fragment
  history.replaceState({}, '', urlWithoutFragment);
  console.log('Current URL after replaceState:', window.location.href);
}

function handlePopState(event) {
  showPreloader()
    .then(() => fetchAndRenderContent(window.location.href))
    .then(hidePreloader);
}

window.addEventListener('popstate', function(event) {
  showPreloader()
    .then(() => fetchAndRenderContentForPopState(window.location.href))
    .then(hidePreloader);
});


export function fetchPages() {
  if (eventListenersAttached) {
    return;
  }

  // Attach click event listener to navigation container
  attachEventListener('.uk-navbar-container');
  attachEventListener('.show-page');

  // Attach click event listener to off-canvas sidebar when it's shown
  UIkit.util.on('#offcanvas-nav', 'shown', handleShownOffcanvasNav);

  // Attach hidden event listener to off-canvas sidebar
  UIkit.util.on('#offcanvas-nav', 'hidden', handleHiddenOffcanvasNav);

  window.addEventListener('popstate', handlePopState);

  eventListenersAttached = true;
}

*/
