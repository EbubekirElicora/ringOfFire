import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() player?: Player;
  @Input() playerActive: boolean = false;
  @Input() imageSrc?: string;

  get avatarSrc(): string {
    return this.imageSrc ?? 'assets/img/profile/default.png';
  }
}