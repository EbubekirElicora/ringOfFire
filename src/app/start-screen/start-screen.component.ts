import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})

export class StartScreenComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private firestore = inject(Firestore);
  private soundService = inject(SoundService);

  private firstInteractionHandler = this.onFirstInteraction.bind(this);

  ngOnInit(): void {
    this.soundService.preloadAll().finally(() => {
      this.soundService.play('intro_game', { loop: true, restart: true, volume: 0.25 });
    });
    document.addEventListener('pointerdown', this.firstInteractionHandler, { once: true, passive: true });
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointerdown', this.firstInteractionHandler as EventListener);
  }

  private async onFirstInteraction(): Promise<void> {
    await this.soundService.tryUnlock();
    this.soundService.play('intro_game', { loop: true, restart: true, volume: 0.25 });
  }

  async newGame(): Promise<void> {
    this.soundService.stop('intro_game');
    this.soundService.play('start_btn', { restart: true, volume: 0.6 });
    setTimeout(() => {
      this.soundService.play('game_music', { loop: true, restart: true, volume: 0.45 });
    }, 150);

    const game = new Game();
    const gamesCollection = collection(this.firestore, 'games');
    const docRef = await addDoc(gamesCollection, game.toJson());
    await this.router.navigate(['/game', docRef.id]);
  }
}