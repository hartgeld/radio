// handlers/offcanvas-nav-highlight-current-page.js

export function highlightCurrentPage() {
    var observer = new MutationObserver(function() {
        var links = document.querySelectorAll('.offcanvas-link');
        var currentUrl = window.location.pathname;
        links.forEach(function(link) {
            var linkUrl = new URL(link.getAttribute('href'), window.location.origin);
            if (linkUrl.pathname === currentUrl) {
                link.classList.add('offcanvas-nav-current-page');
            }
        });
    });

    var targetNode = document.getElementById('offcanvas-nav');
    observer.observe(targetNode, { childList: true });
}