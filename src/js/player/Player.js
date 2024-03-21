import { Howl } from 'howler';
import { updateLabels } from './update-labels'; 

const Player = function(playlist, playAudioBtn, stopAudioBtn) {
  this.playlist = playlist;
  this.index = 0;
  this.playAudioBtn = playAudioBtn;
  this.stopAudioBtn = stopAudioBtn;
  this.progressBar = document.querySelector('.uk-progress-bar');
  this.timer = document.getElementById('timer');
};
  
  Player.prototype = {
  
    playing: function() {
      const sound = this.playlist[this.index].howl;
      if (sound) {
        return sound.playing();
      }
      return false;
    },
  
    play: function(index) {
      console.log('Playing: this =', this);
      const self = this;
      let sound;
      // Stop the other player if it's playing
      if (self === livestreamPlayer && mp3Player?.playlist[mp3Player.index]?.howl?.playing()) {
        mp3Player.stop();
      } else if (self === mp3Player && livestreamPlayer?.playlist[livestreamPlayer.index]?.howl?.playing()) {
        livestreamPlayer.stop();
      }
      index = typeof index === 'number' ? index : self.index;
      const data = self.playlist[index];
      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: data.src,
          html5: data.html5,
          format: data.format
        });
      }
      sound.play();
      // Start updating the progress of the track when the 'play' event is fired
      sound.once('play', function() {
        // Store the duration of the audio file
        self.duration = sound.duration();
        requestAnimationFrame(self.step.bind(self));
      });
      if (sound.state() === 'loaded') {
        self.playAudioBtn.style.display = 'none';
        self.stopAudioBtn.style.display = 'flex';
      } else {
        self.playAudioBtn.style.display = 'none';
        self.stopAudioBtn.style.display = 'flex';
      }
      self.step();
    },
  
    stop: function() {
      console.log('Stopping: this =', this);
      const self = this;
      console.log('Stopping: playlist =', self.playlist, ', index =', self.index);
      // Check if there is a sound at the current index
      if (self.playlist[self.index]) {
        // Check if a Howl object exists
        if (self.playlist[self.index].howl) {
          console.log('Howl object before stopping:', self.playlist[self.index].howl);
          self.playAudioBtn.style.display = 'flex';
          self.stopAudioBtn.style.display = 'none';
          self.playlist[self.index].howl.pause(); // Pause the sound
          console.log('Howl object after stopping:', self.playlist[self.index].howl);
        } else {
          console.log('No Howl object found at the current index');
          return; // Return if no Howl object exists
        }
      } else {
        console.log('No sound at the current index');
        return; // Return if no sound exists at the current index
      }
      // Clear the playlist
      self.playlist = [];
      // Reset the index
      self.index = 0;
      // Log the playlist right before it's cleared
      console.log('Playlist before clearing:', self.playlist);
        // Call updateLabels
      //this.updateLabels();
    },
  
  
    pause: function() {
      console.log('pause method called');
      const sound = this.playlist[this.index].howl;
      if (sound) {
        console.log('howl exists');
        if (sound.playing()) {
          console.log('howl is playing');
          sound.pause();
          this.playAudioBtn.style.display = 'flex';
          this.stopAudioBtn.style.display = 'none';
        } else {
          console.log('howl is not playing');
        }
      } else {
        console.log('howl does not exist');
      }
    },
  
    resume: function() {
      console.log('resume method called');
      const sound = this.playlist[this.index].howl;
      if (sound) {
        console.log('howl exists');
        if (!sound.playing()) {
          console.log('howl is not playing');
          sound.play();
          this.playAudioBtn.style.display = 'none';
          this.stopAudioBtn.style.display = 'flex';
        } else {
          console.log('howl is already playing');
        }
      } else {
        console.log('howl does not exist');
      }
    },
  
    playMP3: function(mp3Url) {
      const self = this;
      // Stop the currently playing sound, if any
      if (self.playlist[self.index]) {
        self.playlist[self.index].howl.stop();
      }
      // Clear the playlist
      self.playlist = [];
      // Reset the index
      self.index = 0;
      // Create a new Howl
      const howl = new Howl({
        src: [mp3Url],
        html5: true,
        format: ['mp3'],
        onload: function() {
          // Start playing the MP3
          self.play(0); // The new sound is now at index 0
          // Start updating the progress bar
          //self.step();
        }
      });
      // Add the MP3 to the playlist
      self.playlist.push({
        src: [mp3Url],
        html5: true,
        format: ['mp3'],
        howl: howl
      });
    },
  
    step: function() {
      var self = this;
      if (self.playlist[self.index]) {
        // Get the Howl we want to manipulate.
        var sound = self.playlist[self.index].howl;
        // If the sound is playing
        if (sound.playing()) {
          // Determine our current seek position.
          var seek = sound.seek() || 0;
          var formattedSeek = self.formatTime(Math.round(seek));
          // Only update the timer if the seek has changed
          if (self.timer.innerHTML !== formattedSeek) {
            self.timer.innerHTML = formattedSeek;
          }
          var duration = sound.duration();
          var formattedDuration = self.formatTime(Math.round(duration));
          var durationElement = document.getElementById('duration');
          // Only update the duration if it has changed
          if (durationElement.innerHTML !== formattedDuration) {
            durationElement.innerHTML = formattedDuration;
          }
          // Calculate the progress of the audio
          var progress = (seek / duration) * 100;
          var formattedProgress = progress + '%';
          // Only update the progress bar if the progress has changed
          if (self.progressBar.style.width !== formattedProgress) {
            self.progressBar.style.width = formattedProgress;
          }
        }
      }
      // Call the `step` function again on the next animation frame
      requestAnimationFrame(self.step.bind(self));
    },
  
    formatTime: function(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = (secs - minutes * 60) || 0;
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    },
  };

export default Player;