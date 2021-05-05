import { Component, OnInit } from '@angular/core'
import { Move } from 'src/app/domain/Move';
import { DataService } from '../../data.service';

declare var ChessBoard: any
declare var Chess: any

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {

  board: any
  game: any
  status: any

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.board = ChessBoard('gameBoard', {
      position: 'start',
      draggable: true,
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });
    this.game = new Chess()
    this.updateStatus()
  }

  onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (this.game.game_over()) return false

    // only pick up pieces for the side to move
    if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  onDrop (source, target) {
    // see if the move is legal
    var move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  onSnapEnd () {
    this.board.position(this.game.fen())
    this.updateStatus()
  }

  updateStatus () {
    var moveColor = 'White'
    if (this.game.turn() === 'b') {
      moveColor = 'Black'
    }

    // checkmate?
    if (this.game.in_checkmate()) {
      this.status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (this.game.in_draw()) {
      this.status = 'Game over, drawn position'
    }

    // game still on
    else {
      this.status = moveColor + ' to move'

      // check?
      if (this.game.in_check()) {
        this.status += ', ' + moveColor + ' is in check'
      }
    }
    console.log(this.status)
    const move  = new Move();
    move.gameId = "123456";
    move.fen = this.game.fen();
    this.dataService.sendPostRequest(move).subscribe((data: any[])=>{
      console.log(data);
    })  
  }
}
