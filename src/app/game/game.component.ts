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
import { Router } from '@angular/router';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule, FormsModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit,OnDestroy {
  pickCardAnimation = false;
  currentCard?: string;
  game!: Game;
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  gameOverShown = false;
  gameOverCountdown = 5;
  private _gameOverIntervalId: any;
  private _gameOverTimeoutId: any;

  ngOnInit(): void {
    this.newGame();
  }

  ngOnDestroy(): void {
    if (this._gameOverIntervalId) {
      clearInterval(this._gameOverIntervalId);
    }
    if (this._gameOverTimeoutId) {
      clearTimeout(this._gameOverTimeoutId);
    }
  }

  newGame(): void {
    this.game = new Game();
    this.clearGameOverTimers();
    this.gameOverShown = false;
    this.gameOverCountdown = 5;
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.players.length > 0 && this.game.stack.length > 0) {
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      if (this.game.players.length > 0) {
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      } else {
        this.game.currentPlayer = 0;
      }
      setTimeout(() => {
        if (this.currentCard) {
          this.game.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
        if (this.game.stack.length === 0) {
          this.startGameOverCountdown();
        }
      }, 1000);
    }
  }

  private startGameOverCountdown() {
    if (this.gameOverShown) return;
    this.gameOverShown = true;
    this.gameOverCountdown = 5;
    this._gameOverIntervalId = setInterval(() => {
      this.gameOverCountdown--;
      if (this.gameOverCountdown <= 0) {
        clearInterval(this._gameOverIntervalId);
      }
    }, 1000);
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
    return this.game.stack.length === 0 && !this.pickCardAnimation;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((result: { name: string; image: string } | undefined) => {
      if (result && result.name && result.image) {
        const player: Player = {
          name: result.name,
          image: result.image
        };
        this.game.players.push(player);
      }
    });
  }
}