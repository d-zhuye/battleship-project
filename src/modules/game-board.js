class GameBoard {
  constructor() {
    this.board = this.createBoard();
    this.fleet = [];
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

    if (ship.orientation == "vertical") {
      ship.rowPos.forEach((x) => {
        ship.colPos.forEach((y) => {
          this.board[x][y].value = 1;
          this.board[x][y].ship = ship;
        });
      });  
    } else {
      ship.colPos.forEach((y) => {
        ship.rowPos.forEach((x) => {
          this.board[x][y].value = 1;
          this.board[x][y].ship = ship;
        });
      });  
    }

    this.fleet.push(ship);
  }
}

export { GameBoard };
