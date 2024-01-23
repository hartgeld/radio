export function fetch_player_metaInfo() {

    return fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_')
    .then(response => response.json())
    .then(data => {
        const isLive = data.live.is_live;
        const streamerName = data.live.streamer_name;

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

        return {
            isLive: isLive,
            streamerName: streamerName
        };
    })
}