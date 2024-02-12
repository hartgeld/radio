// fetch-pages.js
import { initializePlayer } from './player';
import { mp3Player } from './player.js';
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
        console.log('trying to call updateLabels'); // Add this line

        // Show the preloader
        UIkit.modal('#preloader').show();

        fetch(event.target.href)
        .then(response => response.text())
        .then(html => {
          
          // Hide the preloader
          UIkit.modal('#preloader').hide();


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
                    
            // Update the labels of the currently playing MP3
            updateLabels();            

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

export function updateLabels() {
  console.log('updateLabels called');

  // Check if mp3Player and mp3Player.playlist are defined
  if (mp3Player && mp3Player.playlist) {
    const href = mp3Player.playlist[mp3Player.index].src[0];
    console.log('href:', href); // Add this line

    // Find the anchor that matches the currently playing MP3
    const anchor = document.querySelector(`.uk-card a[href="${href}"]`);
    
    // If the anchor is found, find the closest .uk-card
    const card = anchor ? anchor.closest('.uk-card') : null;
    console.log('Card:', card);

    // If the card is found, find the label elements and update them
    if (card) {
      const labelPlaying = card.querySelector('.label_isPlaying');
      const labelPaused = card.querySelector('.label_isPaused');

      console.log('Label playing:', labelPlaying);
      console.log('Label paused:', labelPaused);

      if (mp3Player.playlist[mp3Player.index].howl.playing()) {
        labelPlaying.style.display = 'flex';
        labelPaused.style.display = 'none';
      } else {
        labelPlaying.style.display = 'none';
        labelPaused.style.display = 'flex';
      }
    } else {
      console.error('Card not found');
    }
  }
}