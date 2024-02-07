// fetch-pages.js
import { initializePlayer } from './player';
import UIkit from 'uikit';

export function fetchPages() {
  // Attach click event listener to navigation container
  attachEventListener('.uk-navbar-container');
  attachEventListener('.show-page');

  // Attach click event listener to off-canvas sidebar when it's shown
  UIkit.util.on('#offcanvas-nav', 'shown', function() {
    console.log("adding event listener to offcanvas-nav");
    attachEventListener('#offcanvas-nav');
  });
}

// Create a Map to store the event handler functions
const eventHandlers = new Map();

function attachEventListener(selector) {
  document.querySelectorAll(selector).forEach(element => {
    // Define the event handler function
    const eventHandler = function(event) {
      console.log('Event target:', event.target); // Log the event target
      // Check if the clicked element is a navigation link or a "show-page" link
      if (event.target.tagName === 'A' && (event.target.closest('.uk-navbar-container') || event.target.closest('#offcanvas-nav') || event.target.closest('.show-page'))) {
        // Prevent default action
        event.preventDefault();

        // Log the href attribute of the clicked <a> element
        console.log('Fetching URL:', event.target.href);

        // Fetch the full HTML of the page
        fetch(event.target.href)
        .then(response => response.text())
        .then(html => {
          // Parse the HTML
          const doc = new DOMParser().parseFromString(html, 'text/html');

          // Extract the main content or the show content
          const contentSelector = event.target.classList.contains('show-page') ? '.show-content' : '.uk-flex-auto';
          const contentElement = doc.querySelector(contentSelector);

          if (contentElement) {
            const content = contentElement.innerHTML;

            // Replace the current main content with the new content
            document.querySelector('.uk-flex-auto').innerHTML = content;

            // Update the URL without reloading the page
            history.pushState({}, '', event.target.href);

            // Reattach event listeners
            initializePlayer();
            fetchPages(); // Reattach event listeners for fetching pages
          } else {
            console.error(`No element found for selector "${contentSelector}"`);
          }
        });
      }
    };


    // If there's an existing event handler for this element, remove it
    if (eventHandlers.has(element)) {
      element.removeEventListener('click', eventHandlers.get(element));
    }

    // Store the new event handler function in the Map
    eventHandlers.set(element, eventHandler);

    // Attach the new event listener
    element.addEventListener('click', eventHandler);
  });
}


/*
function attachEventListener(selector) {
  document.querySelectorAll(selector).forEach(element => {
    element.addEventListener('click', function(event) {

      console.log('Event target:', event.target); // Log the event target
      // Check if the clicked element is a navigation link or a "show-page" link
      if (event.target.tagName === 'A' && (event.target.closest('.uk-navbar-container') || event.target.closest('#offcanvas-nav') || event.target.closest('.show-page'))) {
        // Prevent default action
        event.preventDefault();

        // Log the href attribute of the clicked <a> element
        console.log('Fetching URL:', event.target.href);

        // Fetch the full HTML of the page
        fetch(event.target.href)
        .then(response => response.text())
        .then(html => {
          //console.log(html); // Log the fetched HTML
      
          // Parse the HTML
          const doc = new DOMParser().parseFromString(html, 'text/html');
      
          // Extract the main content or the show content
          const contentSelector = event.target.classList.contains('show-page') ? '.show-content' : '.uk-flex-auto';
          const contentElement = doc.querySelector(contentSelector);
      
          if (contentElement) {
            const content = contentElement.innerHTML;
      
            // Replace the current main content with the new content
            document.querySelector('.uk-flex-auto').innerHTML = content;
      
            // Update the URL without reloading the page
            history.pushState({}, '', event.target.href);
      
            // Reattach event listeners
            //initializePlayer();
            fetchPages(); // Reattach event listeners for fetching pages
          } else {
            console.error(`No element found for selector "${contentSelector}"`);
          }
        });
      }

    });
  });
}

*/


