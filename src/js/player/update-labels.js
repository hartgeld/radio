//update-labels.js

import { mp3PlayerWrapper } from './initializePlayer.js';

export function updateLabels(card, isPlaying) {
  const mp3Player = mp3PlayerWrapper.mp3Player;
  
  if (!card && mp3Player && mp3Player.playlist && mp3Player.playlist[mp3Player.index] && mp3Player.playlist[mp3Player.index].mp3Url) {
    const href = mp3Player.playlist[mp3Player.index].mp3Url;
    const anchor = document.querySelector(`.uk-card a[href="${href}"]`);
    card = anchor ? anchor.closest('.uk-card') : null;
  }

  if (card) {
    const labelPlaying = card.querySelector('.label_isPlaying');
    const labelPaused = card.querySelector('.label_isPaused');

    if (isPlaying) {
      labelPlaying.style.display = 'flex';
      labelPaused.style.display = 'none';
    } else {
      labelPlaying.style.display = 'none';
      labelPaused.style.display = 'flex';
    }
  }
}