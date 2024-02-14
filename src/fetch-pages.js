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

  // Add this line at the end of the fetchPages function
  window.addEventListener('popstate', function(event) {
    showPreloader()
      .then(() => fetchAndRenderContent(window.location.href))
      .then(hidePreloader);
  });
}

// Create a Map to store the event handler functions
const eventHandlers = new Map();

let preloaderModal;

function showPreloader() {
  return new Promise(resolve => {
    preloaderModal = document.querySelector('#preloader');
    if (preloaderModal) {
      preloaderModal.style.display = 'block';
    }
    setTimeout(resolve, 100); // Adjust the delay as needed
  });
}

function hidePreloader() {
  return new Promise(resolve => {
    if (preloaderModal) {
      preloaderModal.style.display = 'none';
    }
    setTimeout(resolve, 100); // Adjust the delay as needed
  });
}

function fetchAndRenderContent(event) {
  const url = event.target ? event.target.href : event;
  return fetch(url)
    .then(response => response.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const contentSelector = event.target && event.target.classList.contains('show-page') ? '.show-content' : '.uk-flex-auto';
      const contentElement = doc.querySelector(contentSelector);
      
      if (contentElement) {
        const content = contentElement.innerHTML;
        document.querySelector('.uk-flex-auto').innerHTML = content;
        history.pushState({}, '', url);
        initializePlayer();
        fetchPages();
        updateLabels();            
        window.scrollTo(0, 0); // Add this line
      } else {
        console.error(`No element found for selector "${contentSelector}"`);
      }
    });
}

function attachEventListener(selector) {
  document.querySelectorAll(selector).forEach(element => {
    const eventHandler = function(event) {
      if (event.target.tagName === 'A' && (event.target.closest('.uk-navbar-container') || event.target.closest('#offcanvas-nav') || event.target.closest('.show-page'))) {
        event.preventDefault();
      
        showPreloader()
          .then(() => fetchAndRenderContent(event))
          .then(hidePreloader);
      }
    };

    if (eventHandlers.has(element)) {
      element.removeEventListener('click', eventHandlers.get(element));
    }

    eventHandlers.set(element, eventHandler);
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


// Add this line at the end of the fetchPages function
window.addEventListener('popstate', handlePopState);

function handlePopState(event) {
  showPreloader()
    .then(() => fetchAndRenderContent(window.location.href))
    .then(hidePreloader);
}