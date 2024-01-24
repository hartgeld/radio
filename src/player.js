import { Howl } from 'howler';

const playLivestreamBtn = document.getElementById('playLivestream');
const stopLivestreamBtn= document.getElementById('stopLivestream');

function initializeButtons() {
  const playAudioBtn = document.getElementById('playAudio');
  const stopAudioBtn = document.getElementById('stopAudio');

  if (!playAudioBtn || !stopAudioBtn) {
    console.error('Play or stop button not found');
    return null;
  }

  return { playAudioBtn, stopAudioBtn };
}

let livestreamPlayer;
let mp3Player;

const Player = function(playlist, playAudioBtn, stopAudioBtn) {
  this.playlist = playlist;
  this.index = 0;
  this.playAudioBtn = playAudioBtn;
  this.stopAudioBtn = stopAudioBtn;
};

Player.prototype = {
  play: function(index) {
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
  
    if (sound.state() === 'loaded') {
      self.playAudioBtn.style.display = 'none';
      self.stopAudioBtn.style.display = 'block';
    } else {
      self.playAudioBtn.style.display = 'none';
      self.stopAudioBtn.style.display = 'block';
    }
  },

  stop: function() {
    const self = this;
    const sound = self.playlist[self.index].howl;
  
    if (sound) {
      sound.stop();
      self.playAudioBtn.style.display = 'block';
      self.stopAudioBtn.style.display = 'none';
    }
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

    // Stop the live stream
    self.stop();

    // Add the MP3 to the playlist
    self.playlist.push({
      src: [mp3Url],
      html5: true,
      format: ['mp3'],
      howl: null
    });

    // Start playing the MP3
    self.play(self.playlist.length - 1);
  }
};

async function fetchData() {
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

    livestreamPlayer = new Player([playlist[0]], playLivestreamBtn, stopLivestreamBtn);

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

function handleLivestreamButtonClick(event) {
  event.preventDefault();

  const livestreamUrl = this.getAttribute('href');
  const { playAudioBtn, stopAudioBtn } = initializeButtons();

  // Stop the static audio if it's playing
  if (mp3Player?.playlist[mp3Player.index]?.howl?.playing()) {
    mp3Player.stop();
  }

  if (livestreamPlayer) {
    try {
      livestreamPlayer.play(0);
    } catch (error) {
      console.error('Failed to play existing Player instance:', error);
    }
  } else {
    try {
      livestreamPlayer = new Player([{ src: [livestreamUrl], html5: true, format: ['mp3'], howl: null }], playAudioBtn, stopAudioBtn);
      livestreamPlayer.play(0);
    } catch (error) {
      console.error('Failed to create Player instance:', error);
    }
  }
}

function handleMP3ButtonClick(event) {
  event.preventDefault();

  const mp3Url = this.getAttribute('href');

  // If the clicked MP3 is the same as the currently playing one, do nothing
  if (mp3Player?.playlist[mp3Player.index]?.src[0] === mp3Url) {
    return;
  }

  const { playAudioBtn, stopAudioBtn } = initializeButtons();

  // Show the controls
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'flex';

  // Fetch the title from the h1 tag
  const title = document.querySelector('.uk-card-header h1').textContent;
  console.log("mp3 title is: " + title);

    // Display the title in head_audio-player.html
    const titleElement = document.querySelector('#titleElement'); // Replace '#titleElement' with the selector for the element where you want to display the title
    titleElement.textContent = title;

  // Stop the static audio if it's playing and remove it from the playlist
  if (mp3Player?.playlist[mp3Player.index]?.howl?.playing()) {
    mp3Player.stop();
    mp3Player.playlist.splice(mp3Player.index, 1);
  }

  if (mp3Player) {
    try {
      mp3Player.play(0);
    } catch (error) {
      console.error('Failed to play existing Player instance:', error);
    }
  } else {
    try {
      mp3Player = new Player([{ src: [mp3Url], html5: true, format: ['mp3'], howl: null }], playAudioBtn, stopAudioBtn);
      mp3Player.play(0);
    } catch (error) {
      console.error('Failed to create Player instance:', error);
    }
  }
}


// Initially hide the controls
window.onload = function() {
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'none';
}

export function initializePlayer() {
  fetchData().then(() => {
    // Group event listener assignments together
    playLivestreamBtn.addEventListener('click', () => {
      // Hide the controls
      const controls = document.getElementById('audio-player_controls');
      controls.style.display = 'none';

      // Play the livestream
      livestreamPlayer?.play();
    });
    stopLivestreamBtn.addEventListener('click', () => livestreamPlayer?.stop());

    const mp3Buttons = document.getElementsByClassName('mp3Button');
    Array.from(mp3Buttons).forEach(button => button.addEventListener('click', handleMP3ButtonClick));

    // Add event listener for stopAudio button
    const stopAudioBtn = document.getElementById('stopAudio');
    stopAudioBtn.addEventListener('click', () => {
      console.log('stopAudio button clicked'); // Add this line

      if (mp3Player instanceof Player) {
        console.log('mp3Player is an instance of Player'); // Add this line

        mp3Player.pause();
      }
    });
    // Add event listener for playAudio button
    const playAudioBtn = document.getElementById('playAudio');
    playAudioBtn.addEventListener('click', () => {
      console.log('playAudio button clicked');

      if (mp3Player instanceof Player) {
        console.log('mp3Player is an instance of Player');
        mp3Player.resume();
      }
    });

    // Add event listener for closeAudioPlayer button
    const closeAudioPlayerBtn = document.getElementById('closeAudioPlayer');
    closeAudioPlayerBtn.addEventListener('click', () => {
      // Hide the static audio player
      const controls = document.getElementById('audio-player_controls');
      controls.style.display = 'none';

      // Stop the static audio if it's playing and remove it from the playlist
      if (mp3Player?.playlist[mp3Player.index]?.howl?.playing()) {
        mp3Player.stop();
        mp3Player.playlist.splice(mp3Player.index, 1);
      }
    });

  });
}

