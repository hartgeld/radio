var playBtn = document.getElementById('playBtn');
var pauseBtn = document.getElementById('pauseBtn');

var Player = function(playlist) {
  this.playlist = playlist;
  this.index = 0;
};

Player.prototype = {

  play: function(index) {
      var self = this;
      var sound;

      index = typeof index === 'number' ? index : self.index;
      var data = self.playlist[index];

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
          playBtn.style.display = 'none';
          pauseBtn.style.display = 'block';
      } else {
          playBtn.style.display = 'none';
          pauseBtn.style.display = 'block';
      }

      self.index = index;
  }, 

  stop: function() {
    var self = this;
    var sound = self.playlist[self.index].howl;

    if (sound) {
      sound.stop();
      sound = null;
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
    }
  },

  playMP3: function(mp3Url) {
    var self = this;

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

    // When the MP3 finishes playing, remove it from the playlist and start the live stream
    self.playlist[self.playlist.length - 1].howl.on('end', function() {
      self.playlist.pop();
      self.play(0);
    });
  }
};

var player;

function fetchData() {
  return fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_')
      .then(response => response.json())
      .then(data => {
          let urls = data.station.mounts.map(mount => mount.url);
          const isLive = data.live.is_live;
          const streamerName = data.live.streamer_name;
          //console.log(`Is Live: ${isLive}, Streamer Name: ${streamerName}`);

          let playlist = [{
              src: urls,
              html5: true, 
              format: ['mp3', 'aac', 'ogg'],
              howl: null
          }];

          player = new Player(playlist);
          //console.log('Player created', player);

          var isLiveElement = document.getElementById('isLive');
          var isNotLiveElement = document.getElementById('isNotLive');

          if (isLive) {
              isLiveElement.style.display = 'block';
              isNotLiveElement.style.display = 'none';
                      isLiveElement.innerHTML = `<i class="fas fa-circle" style="color: red;"></i> ${streamerName}`;

          } else {
              isLiveElement.style.display = 'none';
              isNotLiveElement.style.display = 'block';
          }
      })
      //.catch(error => console.error('Error:', error));
}

export function initializePlayer() {
  fetchData().then(() => {
    playBtn.addEventListener('click', function() {
      //console.log('Play button clicked');
      if (player) {
          player.play();
      }
    });
    pauseBtn.addEventListener('click', function() {
      //console.log('Pause button clicked');
      if (player) {
          player.stop();
      }
    });

    // Get references to your buttons
    var mp3Buttons = document.getElementsByClassName('mp3Button');

    // Loop over the buttons
    for (var i = 0; i < mp3Buttons.length; i++) {
      // Add an event listener to the button
      mp3Buttons[i].addEventListener('click', function(event) {
        // Prevent the default action
        event.preventDefault();

        // Get the MP3 URL from the button's href attribute
        var mp3Url = this.getAttribute('href');

        // Play the MP3
        player.playMP3(mp3Url);
      });
    }
    
  });
 
}

