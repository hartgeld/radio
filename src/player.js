
var playBtn = document.getElementById('playBtn');
var pauseBtn = document.getElementById('pauseBtn');

var Player = function(playlist) {
  console.log('Player constructor called');
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

      sound.volume(1.0);  // Set the volume to 0.5

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
      sound.stop();
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
  }
};

var player;

function fetchData() {
  fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_')
      .then(response => response.json())
      .then(data => {
          let urls = data.station.mounts.map(mount => mount.url);
          const isLive = data.live.is_live;
          const streamerName = data.now_playing.streamer;
          console.log(`Is Live: ${isLive}, Streamer Name: ${streamerName}`);

          let playlist = [{
              src: urls,
              html5: true, 
              format: ['mp3', 'aac', 'ogg'],
              howl: null
          }];

          player = new Player(playlist);
          console.log('Player created', player);

          var isLiveElement = document.getElementById('isLive');
          var isNotLiveElement = document.getElementById('isNotLive');

          if (isLive) {
              isLiveElement.style.display = 'block';
              isNotLiveElement.style.display = 'none';
              isLiveElement.innerHTML = `<i class="fas fa-circle" style="color: red;"></i> <span>${streamerName}</span>`;

          } else {
              isLiveElement.style.display = 'none';
              isNotLiveElement.style.display = 'block';
          }
      })
      .catch(error => console.error('Error:', error));
}

// Fetch data immediately when the page loads
fetchData();

// Fetch data every 10 seconds
setInterval(fetchData, 10000);

playBtn.addEventListener('click', function() {
  console.log('Play button clicked');

  if (player) {
      player.play();
  }
});
pauseBtn.addEventListener('click', function() {
  console.log('Pause button clicked');

  if (player) {
      player.stop();
  }
});

