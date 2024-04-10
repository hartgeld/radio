//fetch-render.js
import { fetchContent, parseHTML, getContentSelector, updateDOM, CONTENT_SELECTOR } from './content-handler.js';

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