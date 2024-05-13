// src/js/handlers/tagFilter.js

document.addEventListener('DOMContentLoaded', (event) => {
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
            selectedTagElement.textContent = selectedTag;  // Add this line

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
            selectedTagCountElement.textContent = ' [' + selectedShows.length + ']';  // Add this line

        });
    });

    // Add a click event listener to 'All Shows'
    allShows.addEventListener('click', function() {
        // Show all shows
        shows.forEach(function(show) {
            show.style.display = 'block';
        });
        selectedTagElement.textContent = 'All';
        selectedTagCountElement.textContent = ' [' + shows.length + ']';  // Add this line

    });
});