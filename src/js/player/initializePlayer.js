// initializePlayer.js

import { PlayerManager } from './PlayerManager.js';
import { ButtonManager } from './ButtonManager.js';
import { fetchData } from './playerSetup.js';
import { updateControlPanel } from './updateMP3Controls.js';
import { updateProgressBar } from './mp3PlayerHandlers.js';
import { setupButtonEventListeners } from './eventHandlers.js';


export const playerManager = new PlayerManager();
export const buttonManager = new ButtonManager();

export const mp3PlayerWrapper = { mp3Player: null };
export const selectMp3 = { currentCard: null };

window.onload = function() {
  const { controls, progress_container } = buttonManager.buttons;
  updateControlPanel(false, controls, progress_container);
}

export function initializePlayer() {
  console.log('initializePlayer called');
  // Check if livestreamPlayer is already initialized and playing
  if (playerManager.livestreamPlayer && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index] && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index].howl.playing()) {
    console.log('initializePlayer early return');
    // livestreamPlayer is already initialized and playing, so return early
    return;
  }

  // Fetch data and setup player
  fetchData(buttonManager, playerManager).then(() => {
    const buttons = buttonManager.buttons;
    if (!buttons) {
      console.error('Failed to initialize buttons');
      return;
    }
    setupButtonEventListeners(buttons);
    setInterval(updateProgressBar, 1000);
  });
}