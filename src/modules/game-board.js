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
    for (let row = 0; row < 10; row++) {
      let row = [];
      for (let col = 0; col < 10; col++) {
        const cell = { value: 0, ship: null, hit: false };
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  receiveAttack(row, col) {
    if (this.board[row][col].ship) {
      this.board[row][col].hit = "hit";
      this.board[row][col].ship.hit();
    } else {
      this.board[row][col].hit = "miss";
    }
  }

  placeShip(ship, row, col) {
    ship.setCoords(row, col);

    ship.rowPos.forEach(a => {
      ship.colPos.forEach(b => {
        this.board[a][b].value = 1;
        this.board[a][b].ship = ship;
      })
    })
  }

}

export { GameBoard };

