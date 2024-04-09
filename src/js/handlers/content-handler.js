// content-handler.js

import { initializePlayer } from '../player/initializePlayer.js';
import { fetchPages } from './fetch-pages.js';
import { showPreloader, hidePreloader } from '../utils/preloader.js';
import { updateLabels } from '../player/update-labels.js';

const CONTENT_SELECTOR = '.uk-flex-auto';
const SHOW_PAGE_SELECTOR = '.show-page';
const SHOW_CONTENT_SELECTOR = '.show-content';

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

export function postUpdateActions() {
  initializePlayer();
  fetchPages();
  updateLabels();
  window.scrollTo(0, 0);
  attachEventListener(SHOW_PAGE_SELECTOR);
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
