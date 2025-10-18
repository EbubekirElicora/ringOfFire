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
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(key, audio);
      const promise = new Promise<void>(resolve => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => resolve();
        audio.load();
      });
      promises.push(promise);
    });
    return Promise.all(promises);
  }

  play(key: SoundKey, opts?: { restart?: boolean; loop?: boolean; volume?: number }): void {
    if (this.muted) return;
    const baseAudio = this.sounds.get(key) ?? new Audio(this.soundFiles[key]);
    this.sounds.set(key, baseAudio);
    const effectiveVolume = typeof opts?.volume === 'number' ? opts.volume : this.volume;

    if (opts?.loop) {
      baseAudio.loop = true;
      baseAudio.volume = effectiveVolume;
      if (opts.restart) baseAudio.currentTime = 0;
      baseAudio.play().catch(() => {});
      return;
    }

    if (opts?.restart) {
      baseAudio.volume = effectiveVolume;
      baseAudio.currentTime = 0;
      baseAudio.play().catch(() => {});
      return;
    }

    const clone = baseAudio.cloneNode(true) as HTMLAudioElement;
    clone.volume = effectiveVolume;
    clone.play().catch(() => {});
    clone.onended = () => { /* cleanup not required */ };
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
        try { a.pause(); } catch {}
      });
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    this.sounds.forEach(a => { try { a.volume = this.volume; } catch {} });
  }

  getVolume(): number {
    return this.volume;
  }

  async tryUnlock(): Promise<void> {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAA...'; // tiny silent? optional
      audio.volume = 0;
      await audio.play().catch(() => { });
      audio.pause();
    } catch { /* ignore */ }
  }
}
