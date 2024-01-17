// src/player.js
import $ from 'jquery';
import 'jplayer';

export async function initializePlayer() {
    // Fetch the station data
    const response = await fetch('https://167.172.176.229/api/nowplaying/klo_radio_');
    const data = await response.json();

    // Initialize the player with the station's listen_url
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: data.station.listen_url
            });
        },
        supplied: "mp3",
        wmode: "window",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
    });

    // Add a click event listener to the play button
    $('.jp-play').click(function() {
        $("#jquery_jplayer_1").jPlayer("play");
    });
}

// Call initializePlayer when the "Start Playback" button is clicked
$('#start-playback').click(function() {
    initializePlayer();
    $("#jquery_jplayer_1").jPlayer("play");
});