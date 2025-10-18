import { Component, Input, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { SoundService } from '../services/sound.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-reload-game',
  standalone: true,
  templateUrl: './reload-game.component.html',
  styleUrls: ['./reload-game.component.scss']
})
export class ReloadGameComponent {
  @Input() gameId?: string;

  private firestore = inject(Firestore);
  private soundService = inject(SoundService);

  async reloadGame(): Promise<void> {
    if (!this.gameId) return;
    this.soundService.play('create_btn', { restart: true, volume: 0.6 });
    const newGame = new Game();
    const docRef = doc(this.firestore, `games/${this.gameId}`);
    await setDoc(docRef, newGame.toJson());
  }
}
