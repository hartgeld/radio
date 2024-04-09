//livestreamHandlers.js

import { mp3PlayerWrapper, buttonManager, playerManager } from './initializePlayer.js';
import { fetchData } from './playerSetup.js';
import { updateControlPanel, setMP3Controls } from './updateMP3Controls.js';
import { updateLabels } from './update-labels';
import { selectMp3 } from './initializePlayer.js';

export async function handleLivestreamButtonClick(event) {
  if (mp3PlayerWrapper.mp3Player?.playing()) {
    mp3PlayerWrapper.mp3Player.stop();
    updateLabels(selectMp3.currentCard, false);
  }
  try {
    event.preventDefault();
    const { playLivestreamBtn, stopLivestreamBtn, controls, progress_container } = buttonManager.buttons;
    await fetchData(buttonManager, playerManager);
    updateControlPanel(false, controls, progress_container);
    handleLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn);
  } catch (error) {
    handleError('An error occurred: ', error);
  }
}
  
export function handleLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn) {
  if (!playerManager.livestreamPlayer) {
    handleError('Livestream player does not exist', new Error('Livestream player does not exist'));
  } else if (playerManager.livestreamPlayer.playing()) {
    playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);
    setMP3Controls(playLivestreamBtn, stopLivestreamBtn, false);
  } else {
    playLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn);
  }
}
  
export function playLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn) {
  try {
    playerManager.livestreamPlayer.play(0);
    setMP3Controls(playLivestreamBtn, stopLivestreamBtn, true);
  } catch (error) {
    handleError('An error occurred: ', error);
  }
}

export function stopLivestream() {
  const { playLivestreamBtn, stopLivestreamBtn } = buttonManager.buttons;
  if (playerManager.livestreamPlayer) {
    playerManager.livestreamPlayer.stop();  
    setMP3Controls(playLivestreamBtn, stopLivestreamBtn, false);
  } else {
  }
}

function handleError(message, error) {
  throw new Error(message + error);
}