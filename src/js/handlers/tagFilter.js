// src/js/handlers/tagFilter.js
import UIkit from 'uikit';

function updateTagCounts() {
    var tags = document.querySelectorAll('[data-tag]');
    var shows = document.querySelectorAll('[class^="tag-"]');

    tags.forEach(function(tag) {
        var tagSlug = tag.getAttribute('data-tag');
        var tagCountElement = document.getElementById('tag-count-' + tagSlug);
        var tagShows = document.querySelectorAll('.tag-' + tagSlug);

        if (tagCountElement) {
            tagCountElement.textContent = ' [' + tagShows.length + ']';
        }
    });
}

export function attachTagFilterEventListeners() {
    // Get all tags and shows
    var tags = document.querySelectorAll('[data-tag]');
    var shows = document.querySelectorAll('[class^="tag-"]');
    var allShows = document.getElementById('all-shows');
    var selectedTagElement = document.getElementById('selected-tag');  
    var selectedTagCountElement = document.getElementById('selected-tag-count');  
    var modal = UIkit.modal('#modal-tags');

    // Check if selectedTagElement exists
    if (!selectedTagElement) {
        console.error("Element with id 'selected-tag' does not exist.");
        return;
    }
    
    // Add a click event listener to each tag
    tags.forEach(function(tag) {
        tag.addEventListener('click', function(event) {
            // Prevent the default action
            event.preventDefault();

            // Remove the 'selected' class from all tags
            tags.forEach(function(tag) {
                tag.classList.remove('selected');
            });
            allShows.classList.remove('selected');

            // Add the 'selected' class to the clicked tag
            this.classList.add('selected');

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

            // Close the modal
            modal.hide();

            // Update the tag counts
            updateTagCounts();
        });
    });

    // Add a click event listener to 'All Shows' if it exists
    if (allShows) {
        allShows.addEventListener('click', function(event) {
            event.preventDefault();

            // Remove the 'selected' class from all tags
            tags.forEach(function(tag) {
                tag.classList.remove('selected');
            });

            // Add the 'selected' class to 'All Shows'
            this.classList.add('selected');

            // Show all shows
            shows.forEach(function(show) {
                show.style.display = 'block';
            });
            selectedTagElement.textContent = 'All';
            selectedTagCountElement.textContent = ' [' + shows.length + ']';

            // Close the modal
            modal.hide();

            // Update the tag counts
            updateTagCounts();
        });
    }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    attachTagFilterEventListeners();
    updateTagCounts();
});