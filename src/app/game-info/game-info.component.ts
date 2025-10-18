import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {
  cardAction = [
    { title: 'Waterfall', description: 'Everyone starts drinking at the same time. Stop only when the person before you stops.' },
    { title: 'You', description: 'You choose who drinks and how much!' },
    { title: 'Me', description: 'Congrats! Take a shot!' },
    { title: 'Category', description: 'Pick a category. Each player names something from it. First to hesitate drinks.' },
    { title: 'Bust a Jive', description: 'Make a dance move. Next player repeats and adds one. Fail = drink!' },
    { title: 'Girls Drink', description: 'All girls take a sip!' },
    { title: 'Heaven', description: 'Hands up! Last person drinks!' },
    { title: 'Mate', description: 'Pick a mate. Whenever you drink, they drink too!' },
    { title: 'Thumbmaster', description: 'Put your thumb on the table. Last one drinks!' },
    { title: 'Guys Drink', description: 'All guys take a sip!' },
    { title: 'Quizmaster', description: 'Ask questions. Wrong answer? Drink!' },
    { title: 'Never Have I Ever', description: 'Say something you never did. Anyone who did it drinks!' },
    { title: 'Rule', description: 'Make a rule. Anyone who breaks it drinks!' },
    { title: 'Dance Off', description: 'Show a move. Fail? Drink!' },
    { title: 'Swap', description: 'Swap seats with someone. Hesitate? Drink!' },
    { title: 'Shotgun', description: 'Take a shot immediately!' },
    { title: 'Silent Ninja', description: 'No talking until next turn. Speak? Drink!' },
    { title: 'Mystery', description: 'Pick a secret card. Surprise! Maybe drink.' },
    { title: 'Truth', description: 'Answer a question honestly or drink.' },
    { title: 'Dare', description: 'Do a dare or drink.' },
    { title: 'Chug', description: 'Drink continuously until someone says stop.' },
    { title: 'Two Shots', description: 'Take two shots!' },
    { title: 'Hand Swap', description: 'Switch your dominant hand for drinking until next turn.' },
    { title: 'Story Time', description: 'Tell a story. Fail to be convincing? Drink!' },
    { title: 'Rhyme', description: 'Say a word. Next must rhyme. Fail = drink!' },
    { title: 'Accent', description: 'Speak in an accent until next turn. Fail = drink!' },
    { title: 'Silent Count', description: 'Count silently around the circle. Fail = drink!' },
    { title: 'Partner Challenge', description: 'Pick someone to drink with you.' },
    { title: 'Balance', description: 'Balance your drink on your head for 5 sec. Fail = drink!' },
    { title: 'Trivia', description: 'Answer trivia. Wrong? Drink!' },
    { title: 'Memory', description: 'Repeat the sequence of drinks. Fail = drink!' },
    { title: 'Speed', description: 'Finish your drink fast. Fail = drink extra!' },
    { title: 'Compliment', description: 'Give a compliment. Fail = drink!' },
    { title: 'Laugh', description: 'Make everyone laugh. Fail = drink!' },
    { title: 'Dance Move', description: 'Invent a move. Fail = drink!' },
    { title: 'Imitate', description: 'Imitate someone. Fail = drink!' },
    { title: 'Sing', description: 'Sing a line. Fail = drink!' },
    { title: 'Actor', description: 'Act a scene. Fail = drink!' },
    { title: 'Mime', description: 'Mime an action. Fail = drink!' },
    { title: 'Joke', description: 'Tell a joke. Fail = drink!' },
    { title: 'Story Chain', description: 'Continue a story. Fail = drink!' },
    { title: 'Swap Drink', description: 'Swap drinks with someone.' },
    { title: 'Secret', description: 'Tell a secret or drink!' },
    { title: 'Eye Contact', description: 'Keep eye contact. Fail = drink!' },
    { title: 'Freeze', description: 'Freeze in place. Last to freeze drinks!' },
    { title: 'Animal', description: 'Make animal sounds. Fail = drink!' },
    { title: 'Tongue Twister', description: 'Say it 3x fast. Fail = drink!' },
    { title: 'Story Swap', description: 'Swap stories with neighbor.' },
    { title: 'Cheers', description: 'Toast everyone and drink!' },
    { title: 'Quick Draw', description: 'Point quickly. Last points = drink!' },
    { title: 'Mimic', description: 'Mimic previous player. Fail = drink!' },
    { title: 'Group Drink', description: 'Everyone drinks together!' },
    { title: 'Dance Battle', description: 'Battle in 5 sec dance-off. Loser drinks!' },
    { title: 'Finish Line', description: 'Finish your drink first or drink extra!' }
  ];

  title = '';
  description = '';
  @Input() card?: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }
  }
}

