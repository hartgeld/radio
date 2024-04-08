// initializePlayer.js

// Internal modules
import Player from './Player.js';
import { PlayerManager } from './PlayerManager.js';
import { ButtonManager } from './ButtonManager.js';
import { fetchData } from './playerSetup.js';
import { updateLabels } from './update-labels';
import { updateMP3Controls, setMP3Controls, updateControlPanel } from './updateMP3Controls.js';


let currentCard = null;

const playerManager = new PlayerManager();
const buttonManager = new ButtonManager();

export const mp3PlayerWrapper = { mp3Player: null };

async function handleLivestreamButtonClick(event) {
  if (mp3PlayerWrapper.mp3Player?.playing()) {
    mp3PlayerWrapper.mp3Player.stop();
    updateLabels(currentCard, false);
  }
  try {
    event.preventDefault();
    const { playLivestreamBtn, stopLivestreamBtn, controls, progress_container } = buttonManager.buttons;
    await fetchData(buttonManager, playerManager);
    updateControlPanel(false, controls, progress_container);
    handleLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn);
  } catch (error) {
    handleError('An error occurred: ', error);
  }
}

function handleLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn) {
  if (!playerManager.livestreamPlayer) {
    handleError('Livestream player does not exist', new Error('Livestream player does not exist'));
  } else if (playerManager.livestreamPlayer.playing()) {
    playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);
    setMP3Controls(playLivestreamBtn, stopLivestreamBtn, false);
  } else {
    playLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn);
  }
}

function playLivestreamPlayer(playLivestreamBtn, stopLivestreamBtn) {
  try {
    playerManager.livestreamPlayer.play(0);
    setMP3Controls(playLivestreamBtn, stopLivestreamBtn, true);
  } catch (error) {
    handleError('An error occurred: ', error);
  }
}

function handleError(message, error) {
  throw new Error(message + error);
}

function handlePlayAudioBtnClick() {
  const { playAudioBtn, stopAudioBtn } = buttonManager.buttons;
  playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);
  if (mp3PlayerWrapper.mp3Player instanceof Player) {
    mp3PlayerWrapper.mp3Player.resume();
    setMP3Controls(playAudioBtn, stopAudioBtn, true);
    updateLabels(currentCard, true);
  }
}

function handleStopAudioBtnClick() {
  const { playAudioBtn, stopAudioBtn } = buttonManager.buttons;
  if (mp3PlayerWrapper.mp3Player instanceof Player) {
    mp3PlayerWrapper.mp3Player.pause();
    setMP3Controls(playAudioBtn, stopAudioBtn, false);
    updateLabels(currentCard, false);
  }
}

function handleCloseAudioPlayerBtnClick() {
  const { playAudioBtn, stopAudioBtn, controls, progress_container } = buttonManager.buttons;
  updateControlPanel(false, controls, progress_container);
  playerManager.stopAndResetPlayer(mp3PlayerWrapper.mp3Player);
  setMP3Controls(playAudioBtn, stopAudioBtn, false);
  updateLabels(null, false);
}

function handleMP3ButtonClick(event) {
  event.preventDefault();

  const { playLivestreamBtn, stopLivestreamBtn, playAudioBtn, stopAudioBtn, controls, progress_container, audioplayer_button_streamer_playing, audioplayer_button_streamer_stopped } = buttonManager.buttons;

  const card = event.target.closest('.uk-card');
  const mp3Url = event.currentTarget.getAttribute('href');
  const { textContent: title } = card.querySelector('.uk-card-header h1'); 

  playerManager.pausePlayerAndUpdateButtons(playerManager.livestreamPlayer, playLivestreamBtn, stopLivestreamBtn, card);

  let isPlaying = playerManager.isPlaying(mp3PlayerWrapper.mp3Player);
  if (!playerManager.isCurrentTrack(mp3PlayerWrapper.mp3Player, mp3Url)) {
    updateLabels(card, isPlaying);
  }

  handleCardUpdate(card, playAudioBtn, stopAudioBtn);

  updateControlPanel(true, controls, progress_container);
  
  updateStreamerTitle(audioplayer_button_streamer_playing, audioplayer_button_streamer_stopped, title);
  
  if (playerManager.togglePlayPause(mp3Url)) {
    isPlaying = playerManager.isPlaying(mp3PlayerWrapper.mp3Player); 
    updateLabels(card, isPlaying);
    updateMP3Controls(playAudioBtn, stopAudioBtn, playerManager.mp3Player);
    return;
  }

  handleMP3PlayerInitialization(playAudioBtn, stopAudioBtn);
  handleMP3Playback(card, mp3Url, stopAudioBtn);

  currentCard = card;
}

function handleCardUpdate(card, playAudioBtn, stopAudioBtn) {
  if (currentCard && currentCard !== card) {
    updateLabels(currentCard, false);
    updateMP3Controls(playAudioBtn, stopAudioBtn, mp3PlayerWrapper.mp3Player);
    currentCard = card;
  }
}

function updateStreamerTitle(audioplayer_button_streamer_playing, audioplayer_button_streamer_stopped, title) {
  audioplayer_button_streamer_playing.textContent = title;
  audioplayer_button_streamer_stopped.textContent = title;
}

function handleMP3PlayerInitialization(playAudioBtn, stopAudioBtn) {
  if (!mp3PlayerWrapper.mp3Player) {
    mp3PlayerWrapper.mp3Player = new MP3Player();
  } else {
    setMP3Controls(playAudioBtn, stopAudioBtn, true);
  }
}

function handleMP3Playback(card, mp3Url, stopAudioBtn) {
  if (stopAudioBtn.style.display !== 'none') {
    mp3PlayerWrapper.mp3Player.playMP3(mp3Url, () => {}); 

    const existingTrackIndex = findExistingTrack(mp3PlayerWrapper.mp3Player.playlist, mp3Url); 
    if (existingTrackIndex !== -1) {
      mp3PlayerWrapper.mp3Player.play(existingTrackIndex); 
    }

    mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl.on('play', () => { 
      updateLabels(card, true);
    });

    mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl.on('stop', () => { 
      updateLabels(card, false);
    });
  }
}

function findExistingTrack(playlist, mp3Url) {
  return playlist.findIndex(track => track.src && typeof track.src === 'string' && track.src.includes(mp3Url));
}

function updateProgressBar() {
  // Check if the MP3 player is defined and active
  if (mp3PlayerWrapper.mp3Player && mp3PlayerWrapper.mp3Player.index < mp3PlayerWrapper.mp3Player.playlist.length && mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index]?.howl) {
    // Calculate the MP3 progress
    const progress = mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl.seek() / mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl.duration();
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
  var sound = mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl;
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
  const { controls, progress_container } = buttonManager.buttons;
  updateControlPanel(false, controls, progress_container);
}

export function initializePlayer() {
  // If livestreamPlayer exists and is playing, return
  if (playerManager.livestreamPlayer && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index] && playerManager.livestreamPlayer.playlist[playerManager.livestreamPlayer.index].howl.playing()) {
    return;
  }
  fetchData(buttonManager, playerManager).then(() => {
    const buttons = buttonManager.buttons;
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
  const { playLivestreamBtn, stopLivestreamBtn } = buttonManager.buttons;
  if (playerManager.livestreamPlayer) {
    playerManager.livestreamPlayer.stop();
    console.log("Stop button clicked, livestreamPlayer stopped");

    playLivestreamBtn.style.display = 'flex';
    stopLivestreamBtn.style.display = 'none';
  } else {
    console.log("Stop button clicked, but no livestreamPlayer found");
  }
}
