import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SoundService } from '../app/services/sound.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ringOfFire';
  private sound = inject(SoundService);

  constructor() {
    this.sound.preloadAll().then(() => console.log('Sounds: preload attempted'));
  }

}


