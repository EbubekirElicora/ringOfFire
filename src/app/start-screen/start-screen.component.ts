import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})

export class StartScreenComponent implements OnInit {
  private router: Router = inject(Router);
  private firestore: Firestore = inject(Firestore);

  ngOnInit(): void {
  }

  async newGame(): Promise<void> {
    const game = new Game();
    const gamesCol = collection(this.firestore, 'games');
    const docRef = await addDoc(gamesCol, game.toJson());
    this.router.navigate(['/game', docRef.id]);
  }
}

