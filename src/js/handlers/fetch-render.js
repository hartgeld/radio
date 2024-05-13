//fetch-render.js

import { initializePlayer, selectMp3, mp3PlayerWrapper } from '../player/initializePlayer.js';
import { fetchPages } from './fetch-pages.js'; 
import { updateLabels } from '../player/update-labels.js';
import { setupButtonEventListeners, updateButtonEventListener } from '../player/eventHandlers.js';
import { ButtonManager } from '../player/ButtonManager.js';
import { handleMP3ButtonClick } from '../player/mp3PlayerHandlers.js';
import { attachEventListener } from './content-handler.js';


const SHOW_PAGE_SELECTOR = '.show-page';
const SHOW_CONTENT_SELECTOR = '.show-content';

export const CONTENT_SELECTOR = '.uk-flex-auto';


// fetch and render content
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

// fetch and parse

export function fetchContent(url) {
  return fetch(url)
    .then(response => response.text());
}

export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

// select content

export function getContentSelector(anchor) {
  return anchor.parentElement && anchor.parentElement.classList.contains(SHOW_PAGE_SELECTOR) ? SHOW_CONTENT_SELECTOR : CONTENT_SELECTOR;
}

// update DOM

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


export function postUpdateActions() {

  // Check if the player is already playing
  let isPlaying = false;
  if (mp3PlayerWrapper.mp3Player) {
    isPlaying = mp3PlayerWrapper.mp3Player.playing();
  }
  // Only initialize the player if it's not already playing
  if (!isPlaying) {
    initializePlayer();
  }

  fetchPages().then(() => {
    let isPlaying = false;
    if (mp3PlayerWrapper.mp3Player) {
      isPlaying = mp3PlayerWrapper.mp3Player.playing();
    }
    updateCurrentCardFromPlaylist();

    updateLabels(selectMp3.currentCard, isPlaying);

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

export function updateCurrentCardFromPlaylist() {
  if (mp3PlayerWrapper.mp3Player && mp3PlayerWrapper.mp3Player.playlist && mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index]) {
    const href = mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].mp3Url;
    const anchor = document.querySelector(`.uk-card a[href="${href}"]`);
    selectMp3.currentCard = anchor ? anchor.closest('.uk-card') : null;
  }
}