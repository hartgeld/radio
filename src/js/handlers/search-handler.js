// search-handler.js
//import { fetchPages } from './fetch-pages.js'; 
import { attachEventListener } from './content-handler.js';
import UIkit from 'uikit';

// handlers/search-handler.js
export function initializeSearch() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  var searchButton = document.querySelector('[uk-toggle="target: #modal-search-shows"]');
  var modal = UIkit.modal("#modal-search-shows");

  // Check if the search input element exists
  if (searchInput) {
    var sjs = SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: resultsContainer,
      json: '/search.json',
      searchResultTemplate: '<li class="pill-shape-m uk-margin-small-top"><a href="{url}" class="text-neutral-75">{title} <span class="text-neutral-37">{date}</span></a></li>',
      noResultsText: 'No results found',
    });

    // Create a MutationObserver to watch for changes in the resultsContainer
    var observer = new MutationObserver(function(mutations) {
      // For each mutation
      mutations.forEach(function(mutation) {
        // If nodes were added
        if (mutation.addedNodes.length) {
          // Attach the event listener to the results container
          attachEventListener('#search-results');
        }
      });
    });

    // Start observing the resultsContainer for child list changes
    observer.observe(resultsContainer, { childList: true });

    // Listen for the 'shown' event on the modal
    UIkit.util.on(modal.$el, 'shown', function() {
      // Set the focus on the search input field
      searchInput.focus();
    });

    // Add a 'click' event listener to the results container
    resultsContainer.addEventListener('click', function() {
      // Close the modal
      modal.hide();
    });
  }
}