const playBtn = document.querySelector('.play');
const muteBtn = document.querySelector('.mute');
const unmuteBtn = document.querySelector('.unmute');

let id;

let sound= new Howl({
    src: [
        'https://167.172.176.229/listen/klo_radio_/radio.mp3',
        'https://167.172.176.229/listen/klo_radio_/radio.aac',
        'https://167.172.176.229/listen/klo_radio_/radio.ogg'
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
