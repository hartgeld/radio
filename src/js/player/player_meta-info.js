export function fetch_player_metaInfo() {
    return fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_')
    .then(response => response.json())
    .then(data => {
        const isLive = data.live.is_live;
        const streamerName = data.live.streamer_name;
        var isLiveElement = document.getElementById('isLive');
        var isNotLiveElement = document.getElementById('isNotLive');

        var streamerName_LivestreamStopped = document.getElementById('streamername-LivestreamStopped');
        var streamername_LivestreamPlaying = document.getElementById('streamername-LivestreamPlaying');

        if (isLive) {
            isLiveElement.style.display = 'block';
            isNotLiveElement.style.display = 'none';
            isLiveElement.innerHTML = `<i class="fas fa-circle fa-xs"></i> Live`;
            streamerName_LivestreamStopped.innerHTML = streamerName;
            streamername_LivestreamPlaying.innerHTML = streamerName;

        } else {
            isLiveElement.style.display = 'none';
            isNotLiveElement.style.display = 'block';
            isNotLiveElement.innerHTML = `<i class="fas fa-repeat fa-xs"></i> Replay`;
            streamerName_LivestreamStopped.innerHTML = streamerName;
            streamername_LivestreamPlaying.innerHTML = streamerName;
        }
        return {
            isLive: isLive,
            streamerName: streamerName
        };
    })
}