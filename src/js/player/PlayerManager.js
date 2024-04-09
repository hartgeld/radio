//playerManager.js 

import Player from './Player.js';
import { updateMP3Controls, updateLivestreamControls } from './updateMP3Controls.js';

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
    }
  }

  stopOtherPlayer(currentPlayer) {
    const mp3PlayerPlaying = this.mp3Player?.playlist[this.mp3Player.index]?.howl?.playing();
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
    if (player?.playlist[player.index]?.howl?.playing()) {
      player.pause();
      if (player === this.livestreamPlayer) {
        updateLivestreamControls(playBtn, stopBtn, player);
      } else if (player === this.mp3Player) {
        updateMP3Controls(playBtn, stopBtn, player);
      }
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

  isCurrentTrack(player, url) {
    return player?.playlist[player.index]?.src?.[0] === url;
  }

  isPlaying(player) {
    return player?.playlist[player.index]?.howl?.playing();
  }
}

  