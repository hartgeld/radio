// content-handler.js
import { showPreloader, hidePreloader } from '../utils/preloader.js';
import { fetchAndRenderContentForPopState, fetchAndRenderContent } from './fetch-render';

window.addEventListener('popstate', function(event) {
  showPreloader()
    .then(() => fetchAndRenderContentForPopState(window.location.href))
    .then(hidePreloader);
});

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
