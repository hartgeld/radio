let preloaderModal;

export function showPreloader() {
  console.log('Showing preloader');
  return new Promise(resolve => {
    preloaderModal = document.querySelector('#preloader');
    if (preloaderModal) {
      preloaderModal.style.display = 'flex'; 
      preloaderModal.style.position = 'fixed'; 
    }
    setTimeout(resolve, 100); 
  });
}

export function hidePreloader() {
  console.log('Hiding preloader');
  return new Promise(resolve => {
    if (preloaderModal) {
      preloaderModal.style.display = 'none';
      preloaderModal.style.position = 'fixed'; // Add this line
    }
    setTimeout(resolve, 100); 
  });
}