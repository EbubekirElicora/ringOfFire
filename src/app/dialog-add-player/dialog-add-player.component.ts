import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})

export class DialogAddPlayerComponent {
  name = '';
  avatars = ['1.webp', '2.png', 'monkey.png', 'pinguin.svg', 'serious-woman.svg', 'winkboy.svg'];
  selectedAvatar?: string;

  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
    private soundService: SoundService
  ) { }

  onNoClick(): void {
    this.soundService.play('create_btn', { restart: true });
    this.dialogRef.close();
  }

  selectAvatar(avatar: string): void {
    this.soundService.play('create_btn', { restart: true });
    this.selectedAvatar = avatar;
  }

  canConfirm(): boolean {
    return !!this.name && !!this.selectedAvatar;
  }

  confirm(): void {
    this.soundService.play('create_btn', { restart: true });
    this.dialogRef.close({ name: this.name, image: this.selectedAvatar });
  }

  avatarPath(a: string): string {
    return `assets/img/profile/${a}`;
  }
}