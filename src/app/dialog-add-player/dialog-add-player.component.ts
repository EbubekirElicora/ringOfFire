import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  name: string = '';

  avatars = [
    '1.webp',
    '2.png',
    'monkey.png',
    'pinguin.svg',
    'serious-woman.svg',
    'winkboy.svg'
  ];

  selectedAvatar?: string;

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

  onNoClick() {
    this.dialogRef.close();
  }

  selectAvatar(a: string) {
    this.selectedAvatar = a;
  }

  canConfirm(): boolean {
    return !!this.name && !!this.selectedAvatar;
  }

  avatarPath(a: string): string {
    return `assets/img/profile/${a}`;
  }
}
