import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Player } from "./../../models/player";
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { SoundService } from '../services/sound.service';
import { ReloadGameComponent } from '../reload-game/reload-game.component';
import { BackToMenuComponent } from '../back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, ReloadGameComponent, BackToMenuComponent, MatIconModule, MatButtonModule, FormsModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game: Game = new Game();
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly sound = inject(SoundService);
  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private soundService = inject(SoundService);

  gameOverShown = false;
  showRightControls = true;
  gameOverCountdown = 5;
  topCardBackIndex = 0;
  private gameSub?: Subscription;
  private _gameOverIntervalId: any;
  private _gameOverTimeoutId: any;
  private gameDocRef: any;
  currentGameId?: string;

  cardBacks = [
    'blue_back.png',
    'gray_back.png',
    'green_back.png',
    'purple_back.png',
    'red_back.png',
    'yellow_back.png'
  ];

  /* -------------------- LIFECYCLE -------------------- */
  ngOnInit(): void {
    this.route.params.subscribe(params => this.loadGame(params['id']));
  }

  ngOnDestroy(): void {
    this.clearGameOverTimers();
    this.unsubscribeGame();
    this.soundService.stop('game_music');
  }

  /* -------------------- GAME LOADING (refactored) -------------------- */

  private loadGame(id: string) {
    if (!id) return;
    this.setGameDocRef(id);
    this.unsubscribeGame();
    this.subscribeToGame();
  }

  private setGameDocRef(id: string) {
    this.gameDocRef = doc(this.firestore, `games/${id}`);
    this.currentGameId = id;
  }

  private unsubscribeGame() {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
      this.gameSub = undefined;
    }
  }

  private subscribeToGame() {
    if (!this.gameDocRef) return;
    this.gameSub = docData(this.gameDocRef).subscribe((game: any) => {
      if (!game) return;
      this.applyGameData(game);
    });
  }

  private applyGameData(raw: any) {
    this.game.currentPlayer = raw.currentPlayer ?? 0;
    this.game.playedCards = Array.isArray(raw.playedCards) ? raw.playedCards : [];
    this.game.players = Array.isArray(raw.players) ? raw.players : [];
    this.game.stack = Array.isArray(raw.stack) ? raw.stack : [];
    this.game.player_images = Array.isArray(raw.player_images) ? raw.player_images : [];
    this.game.pickCardAnimation = !!raw.pickCardAnimation;
    this.game.currentCard = raw.currentCard ?? undefined;
  }

  /** -------------------- FIRESTORE -------------------- **/

  private async updateFirestore(): Promise<void> {
    if (this.gameDocRef) {
      await updateDoc(this.gameDocRef, this.game.toJson());
    }
  }

  /** -------------------- SPIELER -------------------- **/

  private addPlayer(name: string, image: string) {
    const player: Player = { name };
    this.game.players.push(player);
    this.game.player_images.push(`assets/img/profile/${image}`);
  }

  async openDialog(): Promise<void> {
    this.showRightControls = false;
    this.soundService.play('create_btn', { restart: true });
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(async (result: { name: string; image: string } | undefined) => {
      this.showRightControls = true;
      if (result && result.name && result.image) {
        this.addPlayer(result.name, result.image);
        await this.updateFirestore();
      }
    });
  }

  /** -------------------- KARTE ZIEHEN -------------------- **/

  async takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length > 0 && this.game.stack.length > 0) {
      this.drawCard();
    }
  }

  private async drawCard() {
    this.playDrawSound();
    this.drawFromStack();
    this.startCardAnimation();
    this.nextPlayer();
    await this.updateFirestore();

    setTimeout(async () => {
      this.pushPlayedCard();
      this.stopCardAnimation();
      await this.updateFirestore();
      this.handleEndOfStack();
    }, 1000);
  }

  /** -------------------- Helper Functions -------------------- **/

  private playDrawSound() {
    this.soundService.play('draw_card', { restart: true });
  }

  private drawFromStack() {
    this.topCardBackIndex = this.game.playedCards.length % this.cardBacks.length; // Farbe festlegen
    this.game.currentCard = this.game.stack.pop()!;
  }

  private startCardAnimation() {
    this.game.pickCardAnimation = true;
  }

  private pushPlayedCard() {
    if (this.game.currentCard) {
      this.game.playedCards.push(this.game.currentCard);
    }
  }

  private stopCardAnimation() {
    this.game.pickCardAnimation = false;
  }

  private handleEndOfStack() {
    if (this.game.stack.length === 0) {
      this.soundService.stop('game_music');
      this.startGameOverCountdown();
      this.soundService.play('special_card', { restart: true, volume: 0.7 });
    }
  }

  private nextPlayer() {
    this.game.currentPlayer++;
    if (this.game.players.length > 0) {
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    } else {
      this.game.currentPlayer = 0;
    }
  }

  /** -------------------- GAME OVER -------------------- **/

  private startGameOverCountdown() {
    if (this.gameOverShown) return;
    this.gameOverShown = true;
    this.gameOverCountdown = 5;
    this._gameOverIntervalId = setInterval(() => this.gameOverCountdown--, 1000);
    this._gameOverTimeoutId = setTimeout(() => {
      this.clearGameOverTimers();
      this.router.navigate(['/']);
    }, 5000);
  }

  private clearGameOverTimers() {
    if (this._gameOverIntervalId) {
      clearInterval(this._gameOverIntervalId);
      this._gameOverIntervalId = undefined;
    }
    if (this._gameOverTimeoutId) {
      clearTimeout(this._gameOverTimeoutId);
      this._gameOverTimeoutId = undefined;
    }
  }

  isGameOver(): boolean {
    return this.game.stack.length === 0 && !this.game.pickCardAnimation;
  }
}
