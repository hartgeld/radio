//ButtonManager.js
export class ButtonManager {
    constructor() {
      this.buttons = this.initializeButtons();
    }
  
    initializeButtons() {
      const playAudioBtn = document.getElementById('playAudio');
      const stopAudioBtn = document.getElementById('stopAudio');
      const playLivestreamBtn = document.getElementById('playLivestream');
      const stopLivestreamBtn = document.getElementById('stopLivestream');
      const closeAudioPlayerBtn = document.getElementById('closeAudioPlayer');
      const controls = document.getElementById('audio-player_controls');
      const progress_container = document.getElementById('progress-container');
      const audioplayer_button_streamer_playing = document.querySelector('#audio-player_button_streamer-name_playing');
      const audioplayer_button_streamer_stopped = document.querySelector('#audio-player_button_streamer-name_stopped');
  
      if (!playAudioBtn || !stopAudioBtn || !playLivestreamBtn || !stopLivestreamBtn || !closeAudioPlayerBtn || !controls || !progress_container || !audioplayer_button_streamer_playing || !audioplayer_button_streamer_stopped) {
        handleError('An error occurred: ', new Error('One or more elements not found'));
      }
      return { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn, controls, progress_container, audioplayer_button_streamer_playing, audioplayer_button_streamer_stopped };
    }
  }