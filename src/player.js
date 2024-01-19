document.addEventListener('DOMContentLoaded', (event) => {
    var elms = ['playBtn', 'pauseBtn'];
    elms.forEach(function(elm) {
      window[elm] = document.getElementById(elm);
    });
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
      
          setTimeout(function() {
            sound.play();
      
            if (sound.state() === 'loaded') {
              playBtn.style.display = 'none';
              pauseBtn.style.display = 'block';
            } else {
              playBtn.style.display = 'none';
              pauseBtn.style.display = 'block';
            }
      
            self.index = index;
          }, 100); // Delay of 1 second
        }, 

        stop: function() {
          var self = this;
          var sound = self.playlist[self.index].howl;
          sound.stop();
          playBtn.style.display = 'block';
          pauseBtn.style.display = 'none';
        }
      };


fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_')
    .then(response => response.json())
    .then(data => {
      let urls = data.station.mounts.map(mount => mount.url);

      let playlist = [{
        src: urls,
        html5: true, 
        format: ['mp3', 'aac', 'ogg'],
        howl: null
      }];

      // Add more tracks to the playlist as needed...
      /*playlist.push({
        src: ['static1.mp3'],
        html5: true,
        format: ['mp3'],
        howl: null});*/

      var player = new Player(playlist);
      
      playBtn.addEventListener('click', function() {
        player.play();
      });
      pauseBtn.addEventListener('click', function() {
        player.stop();
      });
      
    });
    
});