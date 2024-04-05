
import { mp3Player } from './initializePlayer.js';

export function updateMP3Controls(playAudioBtn, stopAudioBtn) {
  if (mp3Player.playlist[mp3Player.index].howl.playing()) {
    playAudioBtn.style.display = 'none';
    stopAudioBtn.style.display = 'flex';
  } else {
    playAudioBtn.style.display = 'flex';
    stopAudioBtn.style.display = 'none';
  }
}