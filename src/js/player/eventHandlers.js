// eventHandlers.js
import { handlePlayAudioBtnClick, handleStopAudioBtnClick, handleCloseAudioPlayerBtnClick, handleMP3ButtonClick, handleProgressBarContainerClick } from './mp3PlayerHandlers.js';
import { handleLivestreamButtonClick, stopLivestream } from './livestreamHandlers.js';

export function setupButtonEventListeners(buttons, handlers) {
  const { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn } = buttons;

  // Remove existing event listeners and add new ones
  updateButtonEventListener(playLivestreamBtn, 'click', handleLivestreamButtonClick);
  updateButtonEventListener(stopLivestreamBtn, 'click', stopLivestream);
  updateButtonEventListener(playAudioBtn, 'click', handlePlayAudioBtnClick);
  updateButtonEventListener(stopAudioBtn, 'click', handleStopAudioBtnClick);
  updateButtonEventListener(closeAudioPlayerBtn, 'click', handleCloseAudioPlayerBtnClick);

  const mp3Buttons = document.getElementsByClassName('mp3Button');
  Array.from(mp3Buttons).forEach(button => {
    updateButtonEventListener(button, 'click', handleMP3ButtonClick);
  });

  const progressBarContainer = document.querySelector('#progress');
  updateButtonEventListener(progressBarContainer, 'click', (event) => handleProgressBarContainerClick(progressBarContainer, event));
}
  
export function updateButtonEventListener(button, event, handler) {
  button.removeEventListener(event, handler);
  button.addEventListener(event, handler);
}