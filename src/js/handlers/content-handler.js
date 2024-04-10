// content-handler.js
import UIkit from 'uikit';
import { initializePlayer, selectMp3, mp3PlayerWrapper } from '../player/initializePlayer.js';
//import { fetchPages } from './fetch-pages.js'; // make sure this import is correct
import { showPreloader, hidePreloader } from '../utils/preloader.js';
import { updateLabels } from '../player/update-labels.js';
import { fetchAndRenderContentForPopState } from './fetch-render';
import { setupButtonEventListeners, updateButtonEventListener } from '../player/eventHandlers.js';
import { ButtonManager } from '../player/ButtonManager.js';
import { handleMP3ButtonClick } from '../player/mp3PlayerHandlers.js';

export const CONTENT_SELECTOR = '.uk-flex-auto';
const SHOW_PAGE_SELECTOR = '.show-page';
const SHOW_CONTENT_SELECTOR = '.show-content';

//from fetch-pages.js
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
  console.log('popstate event fired');

  showPreloader()
    .then(() => fetchAndRenderContentForPopState(window.location.href))
    .then(hidePreloader);
});
// end fetch-pages.js function

export function fetchAndRenderContent(event) {
  if (!event || !event.target) return Promise.resolve();

  const anchor = event.target.closest('a');
  if (!anchor) return Promise.resolve();

  const url = anchor.href;
  return fetchContent(url)
    .then(parseHTML)
    .then(doc => {
      const contentSelector = getContentSelector(anchor);
      const contentElement = doc.querySelector(contentSelector);
      if (contentElement) {
        updateDOM(contentElement, url);
      }
    })
    .catch(error => console.error(`Failed to fetch and render content: ${error}`));
}

export function fetchContent(url) {
  return fetch(url)
    .then(response => response.text());
}

export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

export function getContentSelector(anchor) {
  return anchor.parentElement && anchor.parentElement.classList.contains(SHOW_PAGE_SELECTOR) ? SHOW_CONTENT_SELECTOR : CONTENT_SELECTOR;
}

export function updateDOM(contentElement, url) {
  updateContent(contentElement);
  updateState(url);
  postUpdateActions();
}

export function updateContent(contentElement) {
  const content = contentElement.innerHTML;
  document.querySelector(CONTENT_SELECTOR).innerHTML = content;
}

export function updateState(url) {
  history.pushState({}, '', url);
}

/*
export  function postUpdateActions() {
  initializePlayer();
  fetchPages();
  let isPlaying = false;
  if (mp3PlayerWrapper.mp3Player) {
    isPlaying =  mp3PlayerWrapper.mp3Player.playing();
  }
  
  updateLabels(selectMp3.currentCard, isPlaying);
  console.log("currentCard:" + selectMp3.currentCard.outerHTML);
  window.scrollTo(0, 0);
  attachEventListener(SHOW_PAGE_SELECTOR);
}
*/


// fetch-pages.js function

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

      // Attach hidden event listener to off-canvas sidebar
      UIkit.util.on('#offcanvas-nav', 'hidden', handleHiddenOffcanvasNav);

      window.addEventListener('popstate', handlePopState);

      eventListenersAttached = true;
      resolve();
    }
  });
}


export function postUpdateActions() {

  // Check if the player is already playing
  let isPlaying = false;
  if (mp3PlayerWrapper.mp3Player) {
    isPlaying = mp3PlayerWrapper.mp3Player.playing();
    console.log("mp3Player playing:" + isPlaying);
  }

  // Only initialize the player if it's not already playing
  if (!isPlaying) {
    initializePlayer();
  }

  fetchPages().then(() => {
    let isPlaying = false;
    if (mp3PlayerWrapper.mp3Player) {
      isPlaying = mp3PlayerWrapper.mp3Player.playing();
      console.log("mp3Player playing:" + isPlaying);
    }
    // Update selectMp3.currentCard here
    if (mp3PlayerWrapper.mp3Player && mp3PlayerWrapper.mp3Player.playlist && mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index]) {
      const href = mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].mp3Url;
      const anchor = document.querySelector(`.uk-card a[href="${href}"]`);
      selectMp3.currentCard = anchor ? anchor.closest('.uk-card') : null;
    }

    updateLabels(selectMp3.currentCard, isPlaying);
    if (selectMp3.currentCard) {
      console.log("currentCard:" + selectMp3.currentCard.outerHTML);
    } else {
      console.log("currentCard is null");
    }
    window.scrollTo(0, 0);
    attachEventListener(SHOW_PAGE_SELECTOR);

        // Re-attach event listeners for buttons
        const buttons = ButtonManager.buttons;
        if (buttons) {
          setupButtonEventListeners(buttons);
        }

            // Update event listeners for MP3 buttons
            const mp3Buttons = document.getElementsByClassName('mp3Button');
            Array.from(mp3Buttons).forEach(button => {
              updateButtonEventListener(button, 'click', handleMP3ButtonClick);
            });

  });
}


export const eventHandlers = new Map();

export function attachEventListener(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    const anchors = element.querySelectorAll('a:not(.uk-navbar-toggle)');

    anchors.forEach(anchor => {
      if (anchor) {
        const eventHandler = event => {
          event.preventDefault();

          showPreloader()
            .then(() => fetchAndRenderContent(event))
            .then(hidePreloader)
            .catch(error => console.error('Error:', error));
        };

        if (eventHandlers.has(anchor)) {
          anchor.removeEventListener('click', eventHandlers.get(anchor));
        }

        eventHandlers.set(anchor, eventHandler);
        anchor.addEventListener('click', eventHandler);
      }
    });
  });
}

/*
export function fetchAndRenderContentForPopState(url) {
    return fetchContent(url)
      .then(parseHTML)
      .then(doc => {
        const contentElement = doc.querySelector(CONTENT_SELECTOR);
        if (contentElement) {
          updateDOM(contentElement, url);
        }
      })
      .catch(error => console.error(`Failed to fetch and render content: ${error}`));
  }
*/
