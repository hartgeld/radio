// fetch-pages.js
import { initializePlayer } from './player';
import UIkit from 'uikit';

export function fetchPages() {
  // Attach click event listener to navigation container
  attachEventListener('.uk-navbar-container');

  // Attach click event listener to off-canvas sidebar when it's shown
  UIkit.util.on('#offcanvas-nav', 'shown', function() {
    console.log("adding event listener to offcanvas-nav");
    attachEventListener('#offcanvas-nav');
  });
}

function attachEventListener(selector) {
  document.querySelector(selector).addEventListener('click', function(event) {
    // Check if the clicked element is a navigation link
    if (event.target.tagName === 'A' && (event.target.closest('.uk-navbar-container') || event.target.closest('#offcanvas-nav'))) {
      // Prevent default action
      event.preventDefault();

      // Fetch the full HTML of the page
      fetch(event.target.href)
        .then(response => response.text())
        .then(html => {
          // Parse the HTML
          const doc = new DOMParser().parseFromString(html, 'text/html');

          // Extract the main content
          const mainContent = doc.querySelector('.uk-flex-auto').innerHTML;

          // Replace the current main content with the new main content
          document.querySelector('.uk-flex-auto').innerHTML = mainContent;

          // Update the URL without reloading the page
          history.pushState({}, '', event.target.href);

          // Reattach event listeners
          initializePlayer();
        });
    }
  });
}