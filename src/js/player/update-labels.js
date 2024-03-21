import { mp3Player } from './initializePlayer.js';

export function updateLabels() {
  console.log('updateLabels called');

  // Check if mp3Player and mp3Player.playlist are defined
  if (mp3Player && mp3Player.playlist) {
    const href = mp3Player.playlist[mp3Player.index].src[0];
    console.log('href:', href); // Add this line

    // Find the anchor that matches the currently playing MP3
    const anchor = document.querySelector(`.uk-card a[href="${href}"]`);
    
    // If the anchor is found, find the closest .uk-card
    const card = anchor ? anchor.closest('.uk-card') : null;
    console.log('Card:', card);

    // If the card is found, find the label elements and update them
    if (card) {
      const labelPlaying = card.querySelector('.label_isPlaying');
      const labelPaused = card.querySelector('.label_isPaused');

      console.log('Label playing:', labelPlaying);
      console.log('Label paused:', labelPaused);

      if (mp3Player.playlist[mp3Player.index].howl.playing()) {
        labelPlaying.style.display = 'flex';
        labelPaused.style.display = 'none';
      } else {
        labelPlaying.style.display = 'none';
        labelPaused.style.display = 'flex';
      }
    } else {
      console.error('Card not found');
    }
  }
}