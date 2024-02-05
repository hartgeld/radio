// fetch-pages.js
export function fetchPages() {
    // Attach click event listener to navigation links
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function(event) {
        // Prevent default action
        event.preventDefault();
  
        // Fetch the full HTML of the page
        fetch(this.href)
          .then(response => response.text())
          .then(html => {
            // Parse the HTML
            const doc = new DOMParser().parseFromString(html, 'text/html');
  
            // Extract the main content
            const mainContent = doc.querySelector('.uk-flex-auto').innerHTML;
  
            // Replace the current main content with the new main content
            document.querySelector('.uk-flex-auto').innerHTML = mainContent;
  
            // Update the URL without reloading the page
            history.pushState({}, '', this.href);
          });
      });
    });
  }