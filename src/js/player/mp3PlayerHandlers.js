// mp3PlayerHandlers.js

import Player from './Player.js';
import { mp3PlayerWrapper, buttonManager, playerManager, selectMp3 } from './initializePlayer.js';
import { updateLabels } from './update-labels';
import { updateMP3Controls, setMP3Controls, updateControlPanel } from './updateMP3Controls.js';


export function handlePlayAudioBtnClick() {
    const { playAudioBtn, stopAudioBtn } = buttonManager.buttons;
    playerManager.stopPlayerIfPlaying(playerManager.livestreamPlayer);
    if (mp3PlayerWrapper.mp3Player instanceof Player) {
        mp3PlayerWrapper.mp3Player.resume();
        setMP3Controls(playAudioBtn, stopAudioBtn, true);
        updateLabels(selectMp3.currentCard, true);
    }
}
  
export function handleStopAudioBtnClick() {
    const { playAudioBtn, stopAudioBtn } = buttonManager.buttons;
    if (mp3PlayerWrapper.mp3Player instanceof Player) {
        mp3PlayerWrapper.mp3Player.pause();
        setMP3Controls(playAudioBtn, stopAudioBtn, false);
        updateLabels(selectMp3.currentCard, false);
    }
}
  
export function handleCloseAudioPlayerBtnClick() {
    const { playAudioBtn, stopAudioBtn, controls, progress_container } = buttonManager.buttons;
    updateControlPanel(false, controls, progress_container);
    playerManager.stopAndResetPlayer(mp3PlayerWrapper.mp3Player);
    setMP3Controls(playAudioBtn, stopAudioBtn, false);
    updateLabels(null, false);
}
  
export function handleMP3ButtonClick(event) {
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
  
    selectMp3.currentCard = card;
}
  
export function handleCardUpdate(card, playAudioBtn, stopAudioBtn) {
    if (selectMp3.currentCard && selectMp3.currentCard !== card) {
        updateLabels(selectMp3.currentCard, false);
        updateMP3Controls(playAudioBtn, stopAudioBtn, mp3PlayerWrapper.mp3Player);
        selectMp3.currentCard = card;
    }
}
  
export function updateStreamerTitle(audioplayer_button_streamer_playing, audioplayer_button_streamer_stopped, title) {
    audioplayer_button_streamer_playing.textContent = title;
    audioplayer_button_streamer_stopped.textContent = title;
}
  
export function handleMP3PlayerInitialization(playAudioBtn, stopAudioBtn) {
    if (!mp3PlayerWrapper.mp3Player) {
        mp3PlayerWrapper.mp3Player = playerManager.mp3Player;
    } else {
        setMP3Controls(playAudioBtn, stopAudioBtn, true);
    }
}
  
export function handleMP3Playback(card, mp3Url, stopAudioBtn) {
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
  
export function findExistingTrack(playlist, mp3Url) {
    return playlist.findIndex(track => track.src && typeof track.src === 'string' && track.src.includes(mp3Url));
}

export function updateProgressBar() {
    const { mp3Player } = mp3PlayerWrapper;
    if (mp3Player && mp3Player.index < mp3Player.playlist.length && mp3Player.playlist[mp3Player.index]?.howl) {
        const progress = mp3Player.playlist[mp3Player.index].howl.seek() / mp3Player.playlist[mp3Player.index].howl.duration();
        const progressBar = document.querySelector('.uk-progress-bar');
        progressBar.style.width = `${progress * 100}%`;
    }
}

export function handleProgressBarContainerClick(progressBarContainer, event) {
    const clickPositionInProgressBar = event.clientX - progressBarContainer.getBoundingClientRect().left;
    const clickPositionInPercentage = clickPositionInProgressBar / progressBarContainer.offsetWidth;
    const sound = mp3PlayerWrapper.mp3Player.playlist[mp3PlayerWrapper.mp3Player.index].howl;
    const seekPositionInTrack = clickPositionInPercentage * sound.duration();
    sound.seek(seekPositionInTrack);
    const progressBar = document.querySelector('.uk-progress-bar');
    progressBar.style.width = `${clickPositionInPercentage * 100}%`;
}