const playBtn = document.querySelector('.play');
const muteBtn = document.querySelector('.mute');
const unmuteBtn = document.querySelector('.unmute');

let id;

let sound= new Howl({
    src: 'http://radio.audiomastering.lt:8000/raion', // https://167.172.176.229:8000/radio.mp3
    html5: true, // A live stream can only be played through HTML5 Audio.
    format: ['mp3', 'aac']
});

console.log("play");

playBtn.onclick = function() { id = sound.play(); }
muteBtn.onclick = function() { sound.mute(true, id); }
unmuteBtn.onclick = function() { sound.mute(false, id); }

sound.on('end', function(){ playBtn.disabled = false; });
sound.on('play', function(){ playBtn.disabled = true; });
