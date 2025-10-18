import { Injectable } from '@angular/core';

export type SoundKey = 'create_btn' | 'draw_card' | 'game_music' | 'intro_game' | 'start_btn' | 'special_card';

@Injectable({
  providedIn: 'root'
})

export class SoundService {
  private sounds = new Map<SoundKey, HTMLAudioElement>();
  private muted = false;
  private volume = 0.9;
  private soundFiles: Record<SoundKey, string> = {
    create_btn: 'assets/sounds/create-btn-sound.mp3',
    draw_card: 'assets/sounds/draw-card.mp3',
    game_music: 'assets/sounds/game-music.mp3',
    intro_game: 'assets/sounds/Intro-game-music.mp3',
    start_btn: 'assets/sounds/start-btn-sound.mp3',
    special_card: 'assets/sounds/special-card.mp3'
  };


  preloadAll(): Promise<void[]> {
    const promises: Promise<void>[] = [];
    (Object.keys(this.soundFiles) as SoundKey[]).forEach(key => {
      const url = this.soundFiles[key];
      const audio = this.createAudioElement(url);
      audio.volume = this.volume;
      this.sounds.set(key, audio);
      const promise = this.waitForCanPlayThrough(audio);
      promises.push(promise);
      audio.load();
    });
    return Promise.all(promises);
  }

  play(key: SoundKey, opts?: { restart?: boolean; loop?: boolean; volume?: number }): void {
    if (this.muted) return;
    const baseAudio = this.getOrCreateBaseAudio(key);
    const effectiveVolume = typeof opts?.volume === 'number' ? opts.volume : this.volume;
    if (opts?.loop) {
      this.playLooped(baseAudio, effectiveVolume, !!opts.restart);
      return;
    }
    if (opts?.restart) {
      this.playRestart(baseAudio, effectiveVolume);
      return;
    }
    this.playOneShot(baseAudio, effectiveVolume);
  }

  private createAudioElement(url: string): HTMLAudioElement {
    const audio = new Audio(url);
    audio.preload = 'auto';
    return audio;
  }

  private waitForCanPlayThrough(audio: HTMLAudioElement): Promise<void> {
    return new Promise<void>(resolve => {
      const cleanup = () => {
        audio.oncanplaythrough = null;
        audio.onerror = null;
      };
      audio.oncanplaythrough = () => { cleanup(); resolve(); };
      audio.onerror = () => { cleanup(); resolve(); };
    });
  }

  private getOrCreateBaseAudio(key: SoundKey): HTMLAudioElement {
    const existing = this.sounds.get(key);
    if (existing) return existing;
    const url = this.soundFiles[key];
    const audio = this.createAudioElement(url);
    this.sounds.set(key, audio);
    return audio;
  }

  private playLooped(baseAudio: HTMLAudioElement, volume: number, restart: boolean): void {
    baseAudio.loop = true;
    baseAudio.volume = volume;
    if (restart) {
      try { baseAudio.currentTime = 0; } catch { }
    }
    baseAudio.play().catch(() => { });
  }

  private playRestart(baseAudio: HTMLAudioElement, volume: number): void {
    baseAudio.volume = volume;
    try { baseAudio.currentTime = 0; } catch { }
    baseAudio.play().catch(() => { });
  }

  private playOneShot(baseAudio: HTMLAudioElement, volume: number): void {
    const clone = baseAudio.cloneNode(true) as HTMLAudioElement;
    clone.volume = volume;
    clone.play().catch(() => { });
    clone.onended = () => {
    };
  }

  stop(key: SoundKey): void {
    const audio = this.sounds.get(key);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  }

  setMuted(value: boolean): void {
    this.muted = value;
    if (value) {
      this.sounds.forEach(a => {
        try { a.pause(); } catch { }
      });
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    this.sounds.forEach(a => { try { a.volume = this.volume; } catch { } });
  }

  getVolume(): number {
    return this.volume;
  }

  async tryUnlock(): Promise<void> {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAA...';
      audio.volume = 0;
      await audio.play().catch(() => { });
      audio.pause();
    } catch { }
  }
}
