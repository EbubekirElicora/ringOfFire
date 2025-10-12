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

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule, FormsModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game: Game = new Game();
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);

  gameOverShown = false;
  gameOverCountdown = 5;
  private _gameOverIntervalId: any;
  private _gameOverTimeoutId: any;
  private gameDocRef: any;

  /** -------------------- LIFECYCLE -------------------- **/

  ngOnInit(): void {
    this.route.params.subscribe(params => this.loadGame(params['id']));
  }

  ngOnDestroy(): void {
    this.clearGameOverTimers();
  }

  private loadGame(id: string) {
    if (!id) return;
    this.gameDocRef = doc(this.firestore, `games/${id}`);
    docData(this.gameDocRef).subscribe((game: any) => {
      if (!game) return;
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;
      this.game.player_images = game.player_images;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
    });
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
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(async (result: { name: string; image: string } | undefined) => {
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
    this.game.currentCard = this.game.stack.pop()!;
    this.game.pickCardAnimation = true;
    this.nextPlayer();
    await this.updateFirestore();

    setTimeout(async () => {
      if (this.game.currentCard) {
        this.game.playedCards.push(this.game.currentCard);
      }
      this.game.pickCardAnimation = false;
      await this.updateFirestore();

      if (this.game.stack.length === 0) {
        this.startGameOverCountdown();
      }
    }, 1000);
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
