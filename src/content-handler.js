import { initializePlayer } from './player';
import { fetchPages } from './fetch-pages';
import { showPreloader, hidePreloader } from './preloader.js';
import { updateLabels } from './update-labels'; // Add this line

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

// Create a Map to store the event handler functions
export const eventHandlers = new Map();

export function attachEventListener(selector) {
  console.log('Selector:', selector); // Log the selector
  const elements = document.querySelectorAll(selector);
  console.log('Elements:', elements); // Log the selected elements
  elements.forEach(element => {
    const anchors = element.querySelectorAll('a:not(.uk-navbar-toggle)');
    console.log('Anchors:', anchors); // Log the anchor elements
    anchors.forEach(anchor => {
      if (anchor) {
        const eventHandler = function(event) {
          console.log('Event handler called'); 
          event.preventDefault();
        
          console.log("display preloader");
          showPreloader()
            .then(() => {
              return fetchAndRenderContent(event);
            })
            .then(hidePreloader)
            .catch(error => console.error('Error:', error));
        };

        if (eventHandlers.has(anchor)) {
          console.log('Removing existing event handler'); // Log when removing an existing event handler
          anchor.removeEventListener('click', eventHandlers.get(anchor));
        }

        console.log('Attaching new event handler'); // Log when attaching a new event handler
        eventHandlers.set(anchor, eventHandler);
        anchor.addEventListener('click', eventHandler);
        console.log('Event handlers:', eventHandlers); // Log the eventHandlers map
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
