import $ from 'jquery';
import 'jplayer';

function debug(obj) {
    console.log(obj);
}

export async function initializePlayer() {
    /*
    // Fetch the station data
    const response = await fetch('https://167.172.176.229/api/nowplaying/klo_radio_');
    const data = await response.json();

    // Find the URLs of the MP3 and Ogg streams
    let mp3Url, oggUrl;
    for (let mount of data.station.mounts) {
        if (mount.format === 'mp3') {
            mp3Url = mount.url;
        } else if (mount.format === 'ogg') {
            oggUrl = mount.url;
        }
    }
    */
    const mp3Url = 'https://cdn.freesound.org/previews/718/718689_5674468-lq.mp3';
    const oggUrl = 'https://cdn.freesound.org/previews/718/718689_5674468-lq.ogg';
 

    // Initialize the player with the MP3 and Ogg stream URLs
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: mp3Url,
                oga: oggUrl
            });
            debug($(this));
        },
        pause: function() {
            $(this).jPlayer("clearMedia"); // Stop downloading when not in use
        },
        error: function(event) {
            if(event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                // Setup the media stream again.
                $(this).jPlayer("setMedia", {
                    mp3: mp3Url,
                    oga: oggUrl
                });
            }
        },
        swfPath: 'client/js',
        solution: 'html, flash',
        supplied: 'mp3, oga',
        wmode: "window",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });
}

// Call initializePlayer when the page loads
$(document).ready(function() {
    initializePlayer();
});

$(document).ready(function() {
    $('#start-playback').click(function() {
        console.log('Start playback clicked');
        try {
            $("#jquery_jplayer_1").jPlayer("play");
        } catch (error) {
            console.error('Error playing jPlayer', error);
        }
    });
});