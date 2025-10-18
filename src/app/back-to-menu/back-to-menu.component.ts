import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { SoundService } from '../services/sound.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-back-to-menu',
  standalone: true,
  templateUrl: './back-to-menu.component.html',
  styleUrls: ['./back-to-menu.component.scss']
})
export class BackToMenuComponent {
  @Input() gameId?: string;

  private firestore = inject(Firestore);
  private router = inject(Router);
  private soundService = inject(SoundService);

  constructor() { }

  async backToMenu(): Promise<void> {
    this.soundService.play('create_btn', { restart: true, volume: 0.6 });

    if (this.gameId) {
      const newGame = new Game();
      const docRef = doc(this.firestore, `games/${this.gameId}`);
      await setDoc(docRef, newGame.toJson());
    }

    await this.router.navigate(['/']);
  }
}
