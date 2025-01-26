import { Ship } from "./ship";

class GameBoard {
  constructor() {
    this.board = this.createBoard();
    this.carrier = new Ship("carrier", 5)
    this.battleship = new Ship("battleship", 4);
    this.cruiser = new Ship("cruiser", 3);
    this.submarine = new Ship("submarine", 3);
    this.destroyer = new Ship("destroyer", 2);
  }

  createBoard() {
    let board = [];
    const cell = { value: 0, shipId: null, hit: false };
    for (let row = 0; row < 10; row++) {
      let row = [];
      for (let col = 0; col < 10; col++) {
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  receiveAttack(row, col) {
    this.board[row][col].hit = "miss";
  }

  placeShip(ship, row, col) {
    ship.setCoords(row, col);
    ship.rowPos.forEach(row => {
      ship.colPos.forEach(col => {
        this.board[row][col].value = 1;
        this.board[row][col].shipId = ship.shipId;
      })
    })
  }

}

export { GameBoard };

