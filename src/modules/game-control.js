import { Player } from "./player";

const testPlayer = new Player("Mango");
testPlayer.gameBoard.placeShip(testPlayer.gameBoard.destroyer, 3, 3);

function appendBoard(parentCont) {
  let cellCount = 1;
  const gameBoard = document.createElement("div");
  gameBoard.id = "game-board";
  parentCont.appendChild(gameBoard);

  testPlayer.gameBoard.board.forEach((row) => {
    row.forEach((col) => {
      const div = document.createElement("div");
      div.textContent = col.value;
      div.classList.add("cell");
      if (col.ship) {
        div.textContent = col.ship.shipId;
      }

      div.addEventListener("click", () => {
        const rowIndex = testPlayer.gameBoard.board.indexOf(row);
        const colIndex = row.indexOf(col);
        console.log(rowIndex, colIndex);
      });

      gameBoard.appendChild(div);
      cellCount++;
    });
  });
}

function initializeGamePlay() {
  document.body.innerHTML = "";
  const gamePlay = document.createElement("div");
  gamePlay.id = "game-play";
  document.body.appendChild(gamePlay);

  appendBoard(gamePlay);
}

export { initializeGamePlay };
