import { Howl } from 'howler';
import { updateLabels } from './update-labels';
import { updateMP3Controls} from './updateMP3Controls.js'; 
import { PlayerManager } from './playerManager.js';
import Player from './Player.js';


let currentCard = null;

const playerManager = new PlayerManager();

let mp3Player;


async function fetchData() {
  
  playerManager.stopOtherPlayer(mp3Player);
  
  // fetch data
  try {
    const response = await fetch('https://azura.holgerardelt.de/api/nowplaying/klo_radio_');
    const data = await response.json();
    const isLive = data.live.is_live;
    const streamerName = data.live.streamer_name;
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

    // initialize buttons
    const { playLivestreamBtn, stopLivestreamBtn, playAudioBtn, stopAudioBtn, closeAudioPlayerBtn } = initializeButtons();

    // Init Howl-Object for Livestream Player
    const howl = new Howl({
      src: playlist[0].src,
      format: ['mp3'],
      html5: true
    });

    // Create Livestream Player
    playerManager.createLivestreamPlayer([{ ...playlist[0], howl: howl }], playLivestreamBtn, stopLivestreamBtn);

    // Create mp3Player 
    if (playlist.length > 1) {
      //playerManager.createMp3Player(playlist.slice(1), playAudioBtn, stopAudioBtn);
    } else {
      playerManager.createMp3Player(playlist, playAudioBtn, stopAudioBtn);
    }
    mp3Player = playerManager.mp3Player;
  
    // set streamer name
    const livestreamPlaying = document.getElementById('streamername-LivestreamPlaying');
    const livestreamStopped = document.getElementById('streamername-LivestreamStopped');
    livestreamPlaying.innerHTML = `${streamerName}`;
    livestreamStopped.innerHTML = `${streamerName}`;

    // set live/replay status of livestream
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
    

  } catch (error) {
    console.error('Error:', error);
  }
}

function initializeButtons() {
  const playAudioBtn = document.getElementById('playAudio');
  const stopAudioBtn = document.getElementById('stopAudio');
  const playLivestreamBtn = document.getElementById('playLivestream');
  const stopLivestreamBtn = document.getElementById('stopLivestream');
  const closeAudioPlayerBtn = document.getElementById('closeAudioPlayer');
  if (!playAudioBtn || !stopAudioBtn || !playLivestreamBtn || !stopLivestreamBtn || !closeAudioPlayerBtn) {
    console.error('One or more buttons not found');
    return null;
  }
  return { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn };
}


async function handleLivestreamButtonClick(event) {


   // Check if the mp3Player is playing
   if (playerManager.mp3Player && playerManager.mp3Player.playing()) {
    console.log('mp3Player is playing, about to stop');
    // Stop the mp3Player
    playerManager.mp3Player.stop();
    //updateLabels(currentCard, true);
  }
  
  console.log('handleLivestreamButtonClick was called');

  try {
    event.preventDefault();

    // Get the URL of the livestream from Howl object
    const livestreamUrl = this.getAttribute('href');

    // Initialize livestream buttons
    const { playLivestreamBtn, stopLivestreamBtn } = initializeButtons();

    // Check if the buttons exist
    if (!playLivestreamBtn || !stopLivestreamBtn) {
      throw new Error('Buttons not found');
    }

    // Wait for fetchData to finish
    await fetchData();

    // Assuming playerManager is an instance of PlayerManager
    console.log('mp3Player is playing:', playerManager.mp3Player.playing());
    //playerManager.stopPlayerIfPlaying(playerManager.mp3Player);
    playerManager.stopOtherPlayer(playerManager.livestreamPlayer);
     // Stop and reset the static audio if it's playing
    //playerManager.stopAndResetPlayer(mp3Player);
    console.log('About to stop mp3Player');

    //playerManager.mp3Player.stop();
    //playerManager.mp3Player.clearPlaylist();

    console.log("livestream button clicked, mp3Player paused");

    // Hide the progress bar and audio player controls
    document.getElementById('audio-player_controls').style.display = 'none';
    const progress_container = document.getElementById('progress-container');
    progress_container.style.display = 'none';

    // Create Livestream Player if it doesn't exist and play it
    if (playerManager.livestreamPlayer) {
      if (playerManager.livestreamPlayer.playing()) { // Check if the livestream is already playing
        
        playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);

        playLivestreamBtn.style.display = 'flex';
        stopLivestreamBtn.style.display = 'none';

        if (playerManager.livestreamPlayer.playing()) {
          console.log("livestreamPlayer is still playing after stop was called");
        } else {
          console.log("livestreamPlayer is not playing after stop was called");
        }
      } else {
        console.log("livestreamPlayer is not playing, attempting to start");
        try {


          playerManager.livestreamPlayer.play(0);

          playLivestreamBtn.style.display = 'none';
          stopLivestreamBtn.style.display = 'flex';

          console.log("livestream button clicked, livestreamPlayer started");
        } catch (error) {
          console.error('Failed to play existing Player instance:', error);
        }
      }
    } else {
      console.log("livestreamPlayer does not exist, attempting to create and start");
      try {
        playerManager.livestreamPlayer = new Player([{ src: [livestreamUrl], html5: true, format: ['mp3'], howl: null }], playLivestreamBtn, stopLivestreamBtn);
        playerManager.livestreamPlayer.play(0);
        
        playLivestreamBtn.style.display = 'none';
        stopLivestreamBtn.style.display = 'flex';

        const progress_container = document.getElementById('progress-container');
        progress_container.style.display = 'none';
        
        console.log("livestream button clicked, livestreamPlayer started");

      } catch (error) {
        console.error('Failed to create Player instance:', error);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function handlePlayAudioBtnClick() {
  const { playAudioBtn, stopAudioBtn } = initializeButtons();
  
  // Pause the livestream if it's playing
  playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);
  
  if (mp3Player instanceof Player) {
    mp3Player.resume();
    
    playAudioBtn.style.display = 'none';
    stopAudioBtn.style.display = 'flex';

    // Update the labels of the current card
    updateLabels(currentCard, true);
  }
}

function handleStopAudioBtnClick() {
  const { playAudioBtn, stopAudioBtn } = initializeButtons();
  
  if (mp3Player instanceof Player) {
    mp3Player.pause();
    
    playAudioBtn.style.display = 'flex';
    stopAudioBtn.style.display = 'none';

    // Update the labels of the current card
    updateLabels(currentCard, false);
  }
}

function handleCloseAudioPlayerBtnClick() {
  const { playAudioBtn, stopAudioBtn } = initializeButtons();

  // Hide the static audio player
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'none';
  const progress_container = document.getElementById('progress-container');
  progress_container.style.display = 'none';
  
  // Stop and reset the static audio if it's playing
  playerManager.stopAndResetPlayer(mp3Player);
  
  playAudioBtn.style.display = 'flex';
  stopAudioBtn.style.display = 'none';
  
  updateLabels(null, false);
}

function handleMP3ButtonClick(event) {

  event.preventDefault();

  //load buttons
  const { playLivestreamBtn, stopLivestreamBtn, playAudioBtn, stopAudioBtn } = initializeButtons();

  // Pause the livestream if it's playing
  playerManager.pausePlayerAndUpdateButtons(playerManager.livestreamPlayer, playLivestreamBtn, stopLivestreamBtn);

  // Find the parent card of the clicked button
  const card = event.target.closest('.uk-card');

  // If a different card is clicked, update the labels of the currently playing card
  if (currentCard && currentCard !== card) {
    console.log('Different card clicked');

    // Update the labels of the old card
    updateLabels(currentCard, false);

    playAudioBtn.style.display = 'none';
    stopAudioBtn.style.display = 'flex';

    // Update the currentCard to the newly clicked card
    currentCard = card;
  }

  // Update the labels of the clicked card
  updateLabels(card, mp3Player.playlist[mp3Player.index].howl.playing());


  console.log("mp3Player, check if defined: " + mp3Player);
  if (
    mp3Player?.playlist[mp3Player.index] &&
    mp3Player.playlist[mp3Player.index].src &&
    mp3Player.playlist[mp3Player.index].src[0] === event.currentTarget.getAttribute('href')
  ) {
    console.log("Check if mp3Player.playlist[mp3Player.index] is defined:" + mp3Player.playlist[mp3Player.index]);
    if (mp3Player.playlist[mp3Player.index].howl.playing()) {
      // Update the labels of the clicked card
      updateLabels(card, true);
    } else {
      // Update the labels of the clicked card
      updateLabels(card, false);
    }
  }

  const mp3Url = this.getAttribute('href');

  // Show the controls
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'flex';
  const progress = document.getElementById('progress-container');
  progress.style.display = 'flex';
  
  // Fetch the title from the h1 tag
  const title = card.querySelector('.uk-card-header h1').textContent;
  
  // Display the title in head_audio-player.html
  const audioplayer_button_streamer_playing = document.querySelector('#audio-player_button_streamer-name_playing');
  const audioplayer_button_streamer_stopped = document.querySelector('#audio-player_button_streamer-name_stopped');
  audioplayer_button_streamer_playing.textContent = title;
  audioplayer_button_streamer_stopped.textContent = title;
  
  // If the clicked MP3 is the same as the currently playing one, toggle play/pause
  if (playerManager.togglePlayPause(mp3Url)) {
    updateMP3Controls(playAudioBtn, stopAudioBtn);
    updateLabels(card, mp3Player.playlist[mp3Player.index].howl.playing());
    return;
  }

// Check if the mp3Player is initialized
if (!playerManager.mp3Player) {
  console.log('mp3Player is not initialized');
  // Initialize mp3Player here
  playerManager.mp3Player = new MP3Player();
} else {
  // Hide the play button
  playAudioBtn.style.display = 'none';
  stopAudioBtn.style.display = 'flex';
}

// Get the MP3 URL and play it
if (stopAudioBtn.style.display !== 'none') {
  mp3Player.playMP3(mp3Url, () => {
    // Log the state of mp3Player and card before updating labels
    console.log('mp3Player state before updateLabels:', mp3Player);
    console.log('card state before updateLabels:', card);
  });

  // Add the MP3 to the playlist if it's not already there
  if (mp3Player && Array.isArray(mp3Player.playlist)) {
    console.log("Add the MP3 to the playlist if it's not already there");
    const existingTrackIndex = mp3Player.playlist.findIndex(track => track.src && typeof track.src === 'string' && track.src.includes(mp3Url));
    if (existingTrackIndex !== -1) {
      mp3Player.play(existingTrackIndex);
    }
  }

  // Update the labels when the audio starts playing
  mp3Player.playlist[mp3Player.index].howl.on('play', () => {
    updateLabels(card, true);
  });
}

// Update the labels of the clicked card
updateLabels(card, mp3Player.playlist[mp3Player.index].howl.playing());

currentCard = card;
}

function updateProgressBar() {
  // Check if the MP3 player is defined and active
  if (mp3Player && mp3Player.index < mp3Player.playlist.length && mp3Player.playlist[mp3Player.index]?.howl) {
    // Calculate the MP3 progress
    const progress = mp3Player.playlist[mp3Player.index].howl.seek() / mp3Player.playlist[mp3Player.index].howl.duration();
    // Get the progress bar
    var progressBar = document.querySelector('.uk-progress-bar');
    // Update the width of the progress bar
    progressBar.style.width = (progress * 100) + '%';
  }
}

function handleProgressBarContainerClick(progressBarContainer, event) {
  // Calculate the clicked position within the progress bar container
  var clickPositionInProgressBar = event.clientX - progressBarContainer.getBoundingClientRect().left;
  // Calculate the clicked position as a percentage
  var clickPositionInPercentage = clickPositionInProgressBar / progressBarContainer.offsetWidth;
  // Get the Howl we want to manipulate
  var sound = mp3Player.playlist[mp3Player.index].howl;
  // Calculate the seek position in the audio track
  var seekPositionInTrack = clickPositionInPercentage * sound.duration();
  // Seek to the calculated position
  sound.seek(seekPositionInTrack);
  // Get the progress bar
  var progressBar = document.querySelector('.uk-progress-bar');
  // Update the width of the progress bar
  progressBar.style.width = (clickPositionInPercentage * 100) + '%';
}

// Initially hide the controls
window.onload = function() {
  const controls = document.getElementById('audio-player_controls');
  controls.style.display = 'none';
  const progress_container = document.getElementById('progress-container');
  progress_container.style.display = 'none';
}

export function initializePlayer() {
  // If livestreamPlayer exists and is playing, return
  if (playerManager.livestreamPlayer && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index] && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index].howl.playing()) {
    return;
  }
  fetchData().then(() => {
    const buttons = initializeButtons();
    if (!buttons) {
      console.error('Failed to initialize buttons');
      return;
    }
    const { playAudioBtn, stopAudioBtn, playLivestreamBtn, stopLivestreamBtn, closeAudioPlayerBtn } = buttons;

    // Remove existing event listeners and add new ones
    playLivestreamBtn.removeEventListener('click', handleLivestreamButtonClick);
    playLivestreamBtn.addEventListener('click', handleLivestreamButtonClick);

    stopLivestreamBtn.removeEventListener('click', stopLivestream);
    stopLivestreamBtn.addEventListener('click', stopLivestream);

    playAudioBtn.removeEventListener('click', handlePlayAudioBtnClick);
    playAudioBtn.addEventListener('click', handlePlayAudioBtnClick);

    stopAudioBtn.removeEventListener('click', handleStopAudioBtnClick);
    stopAudioBtn.addEventListener('click', handleStopAudioBtnClick);

    const mp3Buttons = document.getElementsByClassName('mp3Button');
    Array.from(mp3Buttons).forEach(button => {
      button.removeEventListener('click', handleMP3ButtonClick);
      button.addEventListener('click', handleMP3ButtonClick);
    });

    closeAudioPlayerBtn.removeEventListener('click', handleCloseAudioPlayerBtnClick);
    closeAudioPlayerBtn.addEventListener('click', handleCloseAudioPlayerBtnClick);

    const progressBarContainer = document.querySelector('#progress');
    progressBarContainer.removeEventListener('click', handleProgressBarContainerClick);
    progressBarContainer.addEventListener('click', (event) => handleProgressBarContainerClick(progressBarContainer, event));

    setInterval(updateProgressBar, 1000);
  });
}

function stopLivestream() {
  const { playLivestreamBtn, stopLivestreamBtn } = initializeButtons();
  if (playerManager.livestreamPlayer) {
    playerManager.livestreamPlayer.stop();
    console.log("Stop button clicked, livestreamPlayer stopped");

    playLivestreamBtn.style.display = 'flex';
    stopLivestreamBtn.style.display = 'none';
  } else {
    console.log("Stop button clicked, but no livestreamPlayer found");
  }
}

export { mp3Player as mp3Player };