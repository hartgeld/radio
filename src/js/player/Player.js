// Player.js provides Player class, controling audio via Howler.js

import { Howl } from 'howler';

class Player {
  constructor(playerManager, playlist, playAudioBtn, stopAudioBtn) {
    this.playerManager = playerManager;
    this.playlist = playlist;
    this.index = 0;
    this.playAudioBtn = playAudioBtn;
    this.stopAudioBtn = stopAudioBtn;
    this.progressBar = document.querySelector('.uk-progress-bar');
    this.timer = document.getElementById('timer');
    this.durationElement = document.getElementById('duration'); 
  }
  
  getHowl(index) {
    const track = this.playlist[index];
    if (track) {
      if (!track.src && track.mp3Url) {
        track.src = track.mp3Url;
      }
      if (!track.howl) {
        track.howl = new Howl({
          src: track.src,
          html5: track.html5,
          format: track.format,
        });
      }
      return track.howl;
    }
    return null;
  }

  selectTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.index = index;
    } else {
      console.error('Index out of bounds');
    }
  }

  clearPlaylist = () => {
    this.playlist.forEach(track => {
      if (track.howl) {
        track.howl.stop();
        track.howl.unload();
        track.howl = null;
      }
    });
  }

  playing = () => {
    const sound = this.getHowl(this.index);
    const isPlaying = sound ? sound.playing() : false;
    return isPlaying;
  }
  
  play = (index) => {
    if (!this.playlist) {
      return;
    }
  
    if (index !== undefined) {
      try {
        this.selectTrack(index);
      } catch (error) {
        return;
      }
    }
    
    this.playerManager.stopOtherPlayer(this);
  
    index = typeof index === 'number' ? index : this.index;
    const data = this.playlist[index];
  
    if (data) {
      let sound = this.getHowl(index);
      if (!sound) {
        return;
      }
      if (!sound.playing()) {
        sound.play();
        sound.once('play', () => {
          this.duration = sound.duration();
          requestAnimationFrame(this.step.bind(this));
        });
      } else {
      }
      this.step();
    } else {
      throw new Error(`No data at index ${index}`);
    }
  }
  
  stop = () => {
    const sound = this.getHowl(this.index);
    if (sound) {
      if (sound.playing()) {
        sound.stop();
      } else {
      }
      sound.unload();
    }  
    this.index = 0;
  }

  pause = () => {
    const sound = this.getHowl(this.index);
    if (sound) {
      if (sound.playing()) {
        sound.pause();
      } else {
        throw new Error('howl is not playing');
      }
    }
  }
    
  resume = () => {
    const sound = this.getHowl(this.index);
    if (sound) {
      if (!sound.playing()) {
        sound.play();
      } else {
        throw new Error('howl is already playing');
      }
    }
  }

  playMP3 = (mp3Url) => {
    this.index = 0;
    
    // Stop the currently playing sound, if any
    if (this.playlist.length > 0) {
      const sound = this.getHowl(this.index);
      if (sound) {
        sound.stop();
      }
    }
    
    // Ensure that this.playlist is an array before pushing the new MP3
    if (!Array.isArray(this.playlist)) {
      this.playlist = [];
    }
    
    // Create a new Howl
    const howl = new Howl({
      src: [mp3Url],
      html5: true,
      format: ['mp3'],
      onload: () => {
        // Start playing the MP3
        if (this.playlist.length > 0) {
          this.play(0);
        } else {
          throw new Error('Playlist is empty after adding new MP3');
        }
      },
      onloaderror: (id, error) => {
        console.error('Howl load error:', error);
      },
      onplayerror: (id, error) => {
        console.error('Howl play error:', error);
      }
    });
    
    // Clear the playlist and add the new MP3
    this.playlist = [{
      howl: howl,
      mp3Url
    }];
  }

  step = () => {
    // Use getHowl to retrieve the sound
    let sound = this.getHowl(this.index);
    
    // If getHowl returned null, there's no sound or playlist item to process
    if (!sound) {
      return;
    }
    
    // If the sound is playing
    if (sound.playing()) {
      // Determine our current seek position.
      let seek = sound.seek() || 0;
      let formattedSeek = this.formatTime(Math.round(seek));
      // Only update the timer if the seek has changed
      if (this.timer.innerHTML !== formattedSeek) {
        this.timer.innerHTML = formattedSeek;
      }
      let duration = sound.duration();
      let formattedDuration = this.formatTime(Math.round(duration));
      // Only update the duration if it has changed
      if (this.durationElement.innerHTML !== formattedDuration) {
        this.durationElement.innerHTML = formattedDuration;
      }
      // Calculate the progress of the audio
      let progress = (seek / duration) * 100;
      let formattedProgress = progress + '%';
      // Only update the progress bar if the progress has changed
      if (this.progressBar.style.width !== formattedProgress) {
        this.progressBar.style.width = formattedProgress;
      }
    }
    
    // Call the step function again on the next animation frame
    requestAnimationFrame(() => this.step());
  }
  
  formatTime = (secs) => {
    if (typeof secs !== 'number') {
      console.error('Invalid argument type. Expected number, got ' + typeof secs);
      return '0:00';
    }
  
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}

export default Player;