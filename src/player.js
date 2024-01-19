const playBtn = document.querySelector('.play');
const muteBtn = document.querySelector('.mute');
const unmuteBtn = document.querySelector('.unmute');

let id;

let sound= new Howl({
    src: [
        'https://azura.holgerardelt.de/listen/klo_radio_/radio.mp3',
        'https://azura.holgerardelt.de/listen/klo_radio_/radio.aac',
        'https://azura.holgerardelt.de/listen/klo_radio_/radio.ogg'
    ],
    html5: true, // A live stream can only be played through HTML5 Audio.
    format: ['mp3', 'aac', 'ogg']
});

console.log("play");

playBtn.onclick = function() { id = sound.play(); }
muteBtn.onclick = function() { sound.mute(true, id); }
unmuteBtn.onclick = function() { sound.mute(false, id); }

sound.on('end', function(){ playBtn.disabled = false; });
sound.on('play', function(){ playBtn.disabled = true; });

sound.on('loaderror', function(id, error) {
    console.error('Load error', error);
  });
  
  sound.on('playerror', function(id, error) {
    console.error('Play error', error);
  });