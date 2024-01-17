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
        pause: function() {
            $(this).jPlayer("clearMedia"); // Stop downloading when not in use
        },
        error: function(event) {
            if(event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                // Setup the media stream again.
                $(this).jPlayer("setMedia", {
                    mp3: data.station.listen_url
                });
            }
        },
        swfPath: '../dist/jplayer',
        solution: 'html, flash',
        supplied: 'mp3',
        wmode: "window",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });

    // Play the stream
    $("#jquery_jplayer_1").jPlayer("play");
}

// Call initializePlayer when the "Start Playback" button is clicked
$('#start-playback').click(function() {
    initializePlayer();
});