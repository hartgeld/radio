import { Howl } from 'howler';
import { updateLabels } from './fetch-pages.js'; // Adjust the path if necessary


let livestreamPlayer;
let mp3Player;

let currentCard = null; // Add this line outside the function to keep track of the currently playing card

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
      self.stopAudioBtn.style.display = 'block';
    } else {
      self.playAudioBtn.style.display = 'none';
      self.stopAudioBtn.style.display = 'block';
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
        self.playAudioBtn.style.display = 'block';
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
        this.playAudioBtn.style.display = 'block';
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
        this.stopAudioBtn.style.display = 'block';
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

async function fetchData() {
  // If livestreamPlayer exists and is playing, stop it
if (livestreamPlayer && livestreamPlayer.playlist[livestreamPlayer.index] && livestreamPlayer.playlist[livestreamPlayer.index].howl.playing()) {
  livestreamPlayer.stop();
}
  try {
    const response = await fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_');
    const data = await response.json();
    const isLive = data.live.is_live;
    const streamerName = data.live.streamer_name;
    const urls = data.station.mounts.map(mount => mount.url);
    const playlist = [{
      src: urls,
      html5: true, 
      format: ['mp3', 'aac', 'ogg'],
      howl: null
    }];
    const { playLivestreamBtn, stopLivestreamBtn, playAudioBtn, stopAudioBtn, closeAudioPlayerBtn } = initializeButtons();
    
    const howl = new Howl({
      src: playlist[0].src,
      format: ['mp3'],
      html5: true
    });
    
    livestreamPlayer = new Player([{ ...playlist[0], howl: howl }], playLivestreamBtn, stopLivestreamBtn);

    if (playlist.length > 1) {
      mp3Player = new Player(playlist.slice(1), playAudioBtn, stopAudioBtn);
      console.log('MP3 player created', mp3Player);
    } else {
      console.log('No MP3s in the playlist');
    }
    console.log('Livestream player created', livestreamPlayer);
    const isLiveElement = document.getElementById('isLive');
    const isNotLiveElement = document.getElementById('isNotLive');
    if (isLive) {
      isLiveElement.style.display = 'block';
      isNotLiveElement.style.display = 'none';
      isLiveElement.innerHTML = `<i class="fas fa-circle" style="color: red;"></i> ${streamerName}`;
    } else {
      isLiveElement.style.display = 'none';
      isNotLiveElement.style.display = 'block';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function initializeButtons() {
  const playAudioBtn = document.getElementById('playAudio');
  const stopAudioBtn = document.getElementById('stopAudio');
  const playLivestreamBtn = document.getElementById('playLivestream');
  const stopLivestreamBtn = document.getElementById('stopLivestream');
  const closeAudioPlayerBtn = document.getElementById('closeAudioPlayer');
  if (!playAudioBtn || !stopAudioBtn || !playLivestreamBtn || !stopLivestreamBtn || !closeAudioPlayerBtn) {
    console.error('One or more buttons not found');
    return null;
  }
  return { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn };
}

async function handleLivestreamButtonClick(event) {
  console.log('handleLivestreamButtonClick was called');
  try {
    event.preventDefault();
    const livestreamUrl = this.getAttribute('href');
    const { playLivestreamBtn, stopLivestreamBtn } = initializeButtons();
    // Check if the buttons exist
    if (!playLivestreamBtn || !stopLivestreamBtn) {
      throw new Error('Buttons not found');
    }
    // Wait for fetchData to finish
    await fetchData();
    // Pause the static audio if it's playing
    if (mp3Player?.playlist[mp3Player.index]?.howl) {
      mp3Player.pause();
      console.log("livestream button clicked, mp3Player paused");
      // Hide the progress bar and audio player controls
      document.getElementById('audio-player_controls').style.display = 'none';
      const progress_container = document.getElementById('progress-container');
      progress_container.style.display = 'none';
    }
    // Create Livestream Player if it doesn't exist and play it
    if (livestreamPlayer) {
      console.log("livestreamPlayer exists");
      if (livestreamPlayer.playing()) { // Check if the livestream is already playing
        console.log("livestreamPlayer is playing, attempting to stop");
        livestreamPlayer.stop(); // Stop the livestream
        console.log("livestream button clicked, livestreamPlayer stopped");
        if (livestreamPlayer.playing()) {
          console.log("livestreamPlayer is still playing after stop was called");
        } else {
          console.log("livestreamPlayer is not playing after stop was called");
        }
      } else {
        console.log("livestreamPlayer is not playing, attempting to start");
        try {
          livestreamPlayer.play();
          console.log("livestream button clicked, livestreamPlayer started");
        } catch (error) {
          console.error('Failed to play existing Player instance:', error);
        }
      }
    } else {
      console.log("livestreamPlayer does not exist, attempting to create and start");
      try {
        livestreamPlayer = new Player([{ src: [livestreamUrl], html5: true, format: ['mp3'], howl: null }], playAudioBtn, stopAudioBtn);
        livestreamPlayer.play();
        const progress_container = document.getElementById('progress-container');
        progress_container.style.display = 'none';
        console.log("livestream button clicked, livestreamPlayer started");
      } catch (error) {
        console.error('Failed to create Player instance:', error);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function handlePlayAudioBtnClick() {
  console.log('playAudio button clicked');    
  // Pause the livestream if it's playing
  if (livestreamPlayer?.playlist[livestreamPlayer.index]?.howl?.playing()) {
    livestreamPlayer.pause();
  }    
  if (mp3Player instanceof Player) {
    console.log('mp3Player is an instance of Player');
    mp3Player.resume();
  }
}

function handleStopAudioBtnClick() {
  if (mp3Player instanceof Player) {
    mp3Player.pause();
  }
}

function handleCloseAudioPlayerBtnClick() {
  // Hide the static audio player
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'none';
  const progress_container = document.getElementById('progress-container');
  progress_container.style.display = 'none';
  // Stop the static audio if it's playing
  if (mp3Player?.playlist[mp3Player.index]?.howl) {
    mp3Player.playlist[mp3Player.index].howl.stop();
    mp3Player.playlist[mp3Player.index].howl.seek(0);
  }
  updateLabels();
}

function handleMP3ButtonClick(event) {
  event.preventDefault();

  // Find the parent card of the clicked button
  const card = event.target.closest('.uk-card');

  // Find the label elements inside the new card
  const labelPlaying = card.querySelector('.label_isPlaying');
  const labelPaused = card.querySelector('.label_isPaused');

  // If a different card is clicked, update the labels of the currently playing card
  if (currentCard && currentCard !== card) {
    const currentLabelPlaying = currentCard.querySelector('.label_isPlaying');
    const currentLabelPaused = currentCard.querySelector('.label_isPaused');
    currentLabelPlaying.style.display = 'none';
    currentLabelPaused.style.display = 'flex';
  }
  // Update the labels of the clicked card
  if (mp3Player?.playlist[mp3Player.index]?.src[0] === event.currentTarget.getAttribute('href')) {
    if (mp3Player.playlist[mp3Player.index].howl.playing()) {
      labelPlaying.style.display = 'flex';
      labelPaused.style.display = 'none';
    } else {
      labelPlaying.style.display = 'none';
      labelPaused.style.display = 'flex';
    }
  }

  const mp3Url = this.getAttribute('href');
  const { playAudioBtn, stopAudioBtn } = initializeButtons();
  // Show the controls
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'flex';
  const progress = document.getElementById('progress-container');
  progress.style.display = 'flex';
  // Fetch the title from the h1 tag
  const title = document.querySelector('.uk-card-header h1').textContent;
  // Display the title in head_audio-player.html
  const titleElement = document.querySelector('#titleElement');
  titleElement.textContent = title;

  // If the clicked MP3 is the same as the currently playing one, toggle play/pause
  if (mp3Player?.playlist[mp3Player.index]?.src[0] === mp3Url) {
    if (mp3Player.playlist[mp3Player.index].howl.playing()) {
      mp3Player.pause();
      updateLabels();
    } else {
      mp3Player.play();
      updateLabels();
    }
    return;
  }


  // If the sound is currently playing, pause it
  if (mp3Player && mp3Player.playlist[mp3Player.index] && mp3Player.playlist[mp3Player.index].howl.playing()) {
    mp3Player.playlist[mp3Player.index].howl.stop();
    updateLabels();
    //return;
  }

// If mp3Player is undefined, initialize it with the clicked MP3
if (!mp3Player) {
  const howl = new Howl({ 
    src: [mp3Url], 
    html5: true,
    onend: function() {
      playAudioBtn.style.display = '';
      stopAudioBtn.style.display = 'none';
      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },
    onpause: function() {
      console.log('onpause event triggered');

      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },
    onstop: function() {
      console.log('onstop event triggered');

      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },  
    onplay: function() {
      labelPlaying.style.display = 'flex';
      labelPaused.style.display = 'none';
    }
  });
  mp3Player = new Player([{ src: [mp3Url], html5: true, format: ['mp3'], howl }], playAudioBtn, stopAudioBtn);
  const intervalId = setInterval(function() {
    const progressBar = document.querySelector('.uk-progress-bar');
    if (progressBar) {
      clearInterval(intervalId);
      mp3Player.play(0);
      labelPaused.style.display = 'none';
      labelPlaying.style.display = 'flex';
    }
  }, 100);
  return;
}
// Add the MP3 to the playlist if it's not already there
if (!mp3Player.playlist.some(track => track.src[0] === mp3Url)) {
  const howl = new Howl({ 
    src: [mp3Url], 
    html5: true,
    onend: function() {
      playAudioBtn.style.display = '';
      stopAudioBtn.style.display = 'none';
      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },
    onpause: function() {
      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },
    onstop: function() {
      labelPaused.style.display = 'flex';
      labelPlaying.style.display = 'none';
    },
    onplay: function() {
      labelPlaying.style.display = 'flex';
      labelPaused.style.display = 'none';
    }
  });
  mp3Player.playlist = [{ src: [mp3Url], html5: true, format: ['mp3'], howl }]; // Reset the playlist
  mp3Player.index = 0; // Reset the index
  mp3Player.play(mp3Player.index);
  labelPaused.style.display = 'none';
  labelPlaying.style.display = 'flex';
}
currentCard = card;
}

function updateProgressBar() {
  // Check if the MP3 player is defined and active
  if (mp3Player && mp3Player.playlist[mp3Player.index]?.howl) {
    // Calculate the MP3 progress
    const progress = mp3Player.playlist[mp3Player.index].howl.seek() / mp3Player.playlist[mp3Player.index].howl.duration();
    // Get the progress bar
    var progressBar = document.querySelector('.uk-progress-bar');
    // Update the width of the progress bar
    progressBar.style.width = (progress * 100) + '%';
  }
}

function handleProgressBarContainerClick(progressBarContainer, event) {
  // Calculate the clicked position within the progress bar container
  var clickPositionInProgressBar = event.clientX - progressBarContainer.getBoundingClientRect().left;
  // Calculate the clicked position as a percentage
  var clickPositionInPercentage = clickPositionInProgressBar / progressBarContainer.offsetWidth;
  // Get the Howl we want to manipulate
  var sound = mp3Player.playlist[mp3Player.index].howl;
  // Calculate the seek position in the audio track
  var seekPositionInTrack = clickPositionInPercentage * sound.duration();
  // Seek to the calculated position
  sound.seek(seekPositionInTrack);
  // Get the progress bar
  var progressBar = document.querySelector('.uk-progress-bar');
  // Update the width of the progress bar
  progressBar.style.width = (clickPositionInPercentage * 100) + '%';
}

// Initially hide the controls
window.onload = function() {
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'none';
  const progress_container = document.getElementById('progress-container');
  progress_container.style.display = 'none';
}

export function initializePlayer() {
  // If livestreamPlayer exists and is playing, return
  if (livestreamPlayer && livestreamPlayer.playlist[livestreamPlayer.index] && livestreamPlayer.playlist[livestreamPlayer.index].howl.playing()) {
    return;
  }
  fetchData().then(() => {
    const buttons = initializeButtons();
    if (!buttons) {
      console.error('Failed to initialize buttons');
      return;
    }
    const { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn } = buttons;

    // Remove existing event listeners and add new ones
    playLivestreamBtn.removeEventListener('click', handleLivestreamButtonClick);
    playLivestreamBtn.addEventListener('click', handleLivestreamButtonClick);

    stopLivestreamBtn.removeEventListener('click', stopLivestream);
    stopLivestreamBtn.addEventListener('click', stopLivestream);

    playAudioBtn.removeEventListener('click', handlePlayAudioBtnClick);
    playAudioBtn.addEventListener('click', handlePlayAudioBtnClick);

    stopAudioBtn.removeEventListener('click', handleStopAudioBtnClick);
    stopAudioBtn.addEventListener('click', handleStopAudioBtnClick);

    const mp3Buttons = document.getElementsByClassName('mp3Button');
    Array.from(mp3Buttons).forEach(button => {
      button.removeEventListener('click', handleMP3ButtonClick);
      button.addEventListener('click', handleMP3ButtonClick);
    });

    closeAudioPlayerBtn.removeEventListener('click', handleCloseAudioPlayerBtnClick);
    closeAudioPlayerBtn.addEventListener('click', handleCloseAudioPlayerBtnClick);

    const progressBarContainer = document.querySelector('#progress');
    progressBarContainer.removeEventListener('click', handleProgressBarContainerClick);
    progressBarContainer.addEventListener('click', (event) => handleProgressBarContainerClick(progressBarContainer, event));

    setInterval(updateProgressBar, 1000);
  });
}

 function stopLivestream() {
  if (livestreamPlayer) {
    livestreamPlayer.stop();
    console.log("Stop button clicked, livestreamPlayer stopped");
  } else {
    console.log("Stop button clicked, but no livestreamPlayer found");
  }
}

// Add an event listener for the 'stop' event
//mp3Player.on('stop', () => {
  // Update the labels
//  updateLabels();
//});

export { mp3Player };