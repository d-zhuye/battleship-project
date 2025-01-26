import { GameBoard } from "./game-board";

class Player {
  constructor(playerName) {
    this.playerName = playerName;
    this.gameBoard = new GameBoard();
  }
}

export { Player }