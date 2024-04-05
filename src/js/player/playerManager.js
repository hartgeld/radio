//playerManager.js controls multiple Player instances

import Player from './Player.js';

export class PlayerManager {
    constructor() {
      this.livestreamPlayer = null;
      this.mp3Player = null;
    }
  
    createLivestreamPlayer(playlist, playAudioBtn, stopAudioBtn) {
      this.livestreamPlayer = new Player(this, playlist, playAudioBtn, stopAudioBtn);
    }
  
    createMp3Player(playlist, playAudioBtn, stopAudioBtn) {
      this.mp3Player = new Player(this, playlist, playAudioBtn, stopAudioBtn);
    }

    stopPlayerIfPlaying(player) {
    
      if (player?.playlist[player.index]?.howl?.playing()) {
        player.stop();
        player.clearPlaylist();
        //player.unload();
        console.log("Player stopped");
      }
    }
  
    stopOtherPlayer(currentPlayer) {
      console.log('Current player:', currentPlayer);
      console.log('MP3 player playing:', this.mp3Player?.playlist[this.mp3Player.index]?.howl?.playing());
      console.log('Livestream player playing:', this.livestreamPlayer?.playlist[this.livestreamPlayer.index]?.howl?.playing());
    
      const mp3PlayerPlaying = this.mp3Player?.playlist[this.mp3Player.index]?.howl?.playing();
      console.log('mp3PlayerPlaying:', mp3PlayerPlaying);
    
      if (currentPlayer === this.livestreamPlayer && mp3PlayerPlaying) {
        this.mp3Player.stop();
      } else if (currentPlayer === this.mp3Player && this.livestreamPlayer?.playlist[this.livestreamPlayer.index]?.howl?.playing()) {
        this.livestreamPlayer.stop();
      }
    }

    stopAndResetPlayer(player) {
      if (player?.playlist[player.index]?.howl) {
        player.playlist[player.index].howl.stop();
        player.playlist[player.index].howl.seek(0);
      }
    }

    pausePlayerAndUpdateButtons(player, playBtn, stopBtn) {
      console.log('pausePlayerAndUpdateButtons called with player:', player);
      if (player?.playlist[player.index]?.howl?.playing()) {
        console.log('Player is playing, pausing...');
        player.pause();
        playBtn.style.display = 'flex';
        stopBtn.style.display = 'none';
      } else {
        console.log('Player is not playing, not pausing.');
      }
    }

    togglePlayPause(mp3Url) {
      const mp3Player = this.mp3Player;
      if (mp3Player?.playlist[mp3Player.index]?.mp3Url === mp3Url) {
        if (mp3Player.playlist[mp3Player.index].howl.playing()) {
          mp3Player.pause();
        } else {
          mp3Player.play();
        }
        return true;
      }
      return false;
    }
  }

  