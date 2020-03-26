import { Component, OnInit } from '@angular/core'

declare var ChessBoard: any;

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {

  constructor() { }

  board: any;

  ngOnInit(): void {
    this.board = ChessBoard('board1', {
      position: 'start',
      draggable: true
    });
  }

}
