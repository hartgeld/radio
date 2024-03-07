let preloaderModal;

export function showPreloader() {
  console.log('Showing preloader');
  return new Promise(resolve => {
    preloaderModal = document.querySelector('#preloader');
    if (preloaderModal) {
      preloaderModal.style.display = 'flex'; // Change this to 'block' or 'flex' or whatever is appropriate
      preloaderModal.style.position = 'fixed'; // Add this line
    }
    setTimeout(resolve, 100); // Adjust the delay as needed
  });
}

export function hidePreloader() {
  console.log('Hiding preloader');
  return new Promise(resolve => {
    if (preloaderModal) {
      preloaderModal.style.display = 'none';
      preloaderModal.style.position = 'fixed'; // Add this line
    }
    setTimeout(resolve, 100); // Adjust the delay as needed
  });
}