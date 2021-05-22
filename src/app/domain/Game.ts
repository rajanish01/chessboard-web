
export class Game{

    gameId : string
    fen : string
    botSide : string
    playingRandom : boolean

    constructor(botSide: string,playingRandom: boolean,gameId?: string,fen?: string){
        this.gameId = gameId
        this.fen = fen
        this.botSide = botSide
        this.playingRandom = playingRandom
    }
}