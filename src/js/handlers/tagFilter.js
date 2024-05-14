
// src/js/handlers/tagFilter.js

export function attachTagFilterEventListeners() {
    // Get all tags and shows
    var tags = document.querySelectorAll('[data-tag]');
    var shows = document.querySelectorAll('[class^="tag-"]');
    var allShows = document.getElementById('all-shows');
    var selectedTagElement = document.getElementById('selected-tag');  
    var selectedTagCountElement = document.getElementById('selected-tag-count');  

    // Add a click event listener to each tag
    tags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            // Get the selected tag
            var selectedTag = this.getAttribute('data-tag');
            selectedTagElement.textContent = selectedTag;

            // Hide all shows
            shows.forEach(function(show) {
                show.style.display = 'none';
            });

            // Show only the shows with the selected tag
            var selectedShows = document.querySelectorAll('.tag-' + selectedTag);
            selectedShows.forEach(function(show) {
                show.style.display = 'block';
            });

            // Update the selected tag count
            selectedTagCountElement.textContent = ' [' + selectedShows.length + ']';
        });
    });

    // Add a click event listener to 'All Shows' if it exists
    if (allShows) {
        allShows.addEventListener('click', function() {
            // Show all shows
            shows.forEach(function(show) {
                show.style.display = 'block';
            });
            selectedTagElement.textContent = 'All';
            selectedTagCountElement.textContent = ' [' + shows.length + ']';
        });
    }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', attachTagFilterEventListeners);