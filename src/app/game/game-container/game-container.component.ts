import { Component, OnInit } from '@angular/core'
import { Game } from 'src/app/domain/Game';
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
  gameControl: any
  status: any
  game: Game

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getNewGame()
    this.createGame()
  }

  createGame(fen?: string){
    this.board = ChessBoard('gameBoard', {
      orientation: 'white',  // TO SET ORIENTATION
      position: fen == null ? 'start' : fen,
      draggable: true,
      moveSpeed: 'slow',
      snapbackSpeed: 500,
      snapSpeed: 100,
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });
    this.gameControl = new Chess()
    this.updateStatus()
  }

  onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (this.gameControl.game_over()) return false

    // only pick up pieces for the side to move
    if ((this.gameControl.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (this.gameControl.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  onDrop (source, target) {
    // see if the move is legal
    var move = this.gameControl.move({
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
    this.board.position(this.gameControl.fen())
    this.updateStatus()
    var turn = this.gameControl.turn() === 'b' ? 'BLACK' : 'WHITE'
    if(this.game.botSide === turn){
      this.getNextMove()
    }
  }

  updateStatus () {
    var moveColor = 'WHITE'
    if (this.gameControl.turn() === 'b') {
      moveColor = 'BLACK'
    }

    // checkmate?
    if (this.gameControl.in_checkmate()) {
      this.status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (this.gameControl.in_draw()) {
      this.status = 'Game over, drawn position'
    }

    // game still on
    else {
      this.status = moveColor + ' to move'

      // check?
      if (this.gameControl.in_check()) {
        this.status += ', ' + moveColor + ' is in check'
      }
    }
    console.log(this.status)
  }

  getNewGame(){
    var botSide = "BLACK"
    const body  = new Game(botSide,true);
    this.dataService.getNewGame(body).subscribe((data: Game)=>{
      this.game = data
      if(botSide === "WHITE"){
        this.board.position(this.game.fen)
        this.gameControl.load(this.game.fen)
        this.updateStatus()
      }
    });
  }

  getNextMove(){
    this.game.fen = this.gameControl.fen()
    const body  = this.game
    this.dataService.getNextMove(body).subscribe((data: Game)=>{
      this.game = data
      this.board.position(this.game.fen)
      this.gameControl.load(this.game.fen)
      this.updateStatus()
    });
  }
}
