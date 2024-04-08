let preloaderModal;

export function showPreloader() {
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
  return new Promise(resolve => {
    if (preloaderModal) {
      preloaderModal.style.display = 'none';
      preloaderModal.style.position = 'fixed'; 
    }
    setTimeout(resolve, 100); 
  });
}

export function handleOnLoad() {
  // Hide the preloader after a delay
  setTimeout(() => {
    hidePreloader();
  }, 1000); // 1000 milliseconds = 1 second
}