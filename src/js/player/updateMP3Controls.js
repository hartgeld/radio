//updateMP3Controls.js

// checks the playing state of the mp3Player and updates the display properties of the play and stop buttons
export function updateMP3Controls(playAudioBtn, stopAudioBtn, mp3Player) {
  if (mp3Player.playlist[mp3Player.index].howl.playing()) {
    playAudioBtn.style.display = 'none';
    stopAudioBtn.style.display = 'flex';
  } else {
    playAudioBtn.style.display = 'flex';
    stopAudioBtn.style.display = 'none';
  }
}

// directly sets the display properties of the play and stop buttons based on the isPlaying parameter
export function setMP3Controls(playAudioBtn, stopAudioBtn, isPlaying) {
  playAudioBtn.style.display = isPlaying ? 'none' : 'flex';
  stopAudioBtn.style.display = isPlaying ? 'flex' : 'none';
}

// Updates the display of the control panel based on the isDisplayed parameter
export function updateControlPanel(isDisplayed, controls, progress) {
  controls.style.display = isDisplayed ? 'flex' : 'none';
  progress.style.display = isDisplayed ? 'flex' : 'none';
}

// checks the playing state of the livestreamPlayer and updates the display properties of the play and stop buttons
export function updateLivestreamControls(playLivestreamBtn, stopLivestreamBtn, livestreamPlayer) {
  if (livestreamPlayer.playlist[livestreamPlayer.index].howl.playing()) {
    playLivestreamBtn.style.display = 'none';
    stopLivestreamBtn.style.display = 'flex';
  } else {
    playLivestreamBtn.style.display = 'flex';
    stopLivestreamBtn.style.display = 'none';
  }
}