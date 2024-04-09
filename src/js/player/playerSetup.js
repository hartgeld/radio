//playerSetup.js

import { mp3PlayerWrapper } from './initializePlayer.js';

export async function fetchData(buttonManager, playerManager) {
  try {
    const data = await getApiData('https://azura.holgerardelt.de/api/nowplaying/klo_radio_');
    const playlist = createPlaylist(data);
    initializePlayers(playlist, buttonManager, playerManager);
    setStreamerName(data.live.streamer_name);
    setLiveStatus(data.live.is_live);
  } catch (error) {
    console.error('Error:', error);
  }
}
  
export async function getApiData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
  
export function createPlaylist(data) {
  const urls = data.station.mounts.map(mount => mount.url);
  const playlist = [{
    src: urls,
    html5: true, 
    format: ['mp3', 'aac', 'ogg'],
    howl: new Howl({
      src: urls,
      format: ['mp3'],
      html5: true
    })
  }];
  return playlist;
}
  
export function initializePlayers(playlist, buttonManager, playerManager) {
  const { playLivestreamBtn, stopLivestreamBtn, playAudioBtn, stopAudioBtn } = buttonManager.buttons;
  const howl = new Howl({
    src: playlist[0].src,
    format: ['mp3'],
    html5: true
  });
  playerManager.createLivestreamPlayer([{ ...playlist[0], howl: howl }], playLivestreamBtn, stopLivestreamBtn);
  if (playlist.length > 1) {
    //playerManager.createMp3Player(playlist.slice(1), playAudioBtn, stopAudioBtn);
  } else {
    playerManager.createMp3Player(playlist, playAudioBtn, stopAudioBtn);
  }
  mp3PlayerWrapper.mp3Player = playerManager.mp3Player;
}
  
export function setStreamerName(streamerName) {
  const livestreamPlaying = document.getElementById('streamername-LivestreamPlaying');
  const livestreamStopped = document.getElementById('streamername-LivestreamStopped');
  livestreamPlaying.innerHTML = `${streamerName}`;
  livestreamStopped.innerHTML = `${streamerName}`;
}
  
export function setLiveStatus(isLive) {
  const isLiveElement = document.getElementById('isLive');
  const isNotLiveElement = document.getElementById('isNotLive');  
  if (isLive) {
    isLiveElement.style.display = 'block';
    isNotLiveElement.style.display = 'none';
    isLiveElement.innerHTML = `<i class="fas fa-circle fa-xs"></i> Live`;
  } else {
    isLiveElement.style.display = 'none';
    isNotLiveElement.style.display = 'block';
    isNotLiveElement.innerHTML = `<i class="fas fa-repeat fa-xs"></i> Replay`;
  }
}
  
  