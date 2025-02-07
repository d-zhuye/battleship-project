import { gamePlay } from "./game-control";
import { player, computer } from "./game-control";
import { endGame } from "./end-game";

export const startBattle = () => {
  gamePlay.innerHTML = "";

  let turn = "Player";

  const activeMaps = document.createElement("div");
  activeMaps.id = "active-maps";
  gamePlay.appendChild(activeMaps);

  [computer, player].forEach((user) => {
    const map = document.createElement("div");
    map.classList.add("map");
    activeMaps.appendChild(map);

    user.gameBoard.board.forEach((row) => {
      row.forEach((col) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (col.ship) {
          cell.textContent = col.ship.shipId;
          if (user.name == "Player")
            cell.style.background = "rgba(0, 255, 175, 0.4)";
        }
        map.appendChild(cell);

        cell.addEventListener("click", () => {
          if (turn != user.name) {
            const rowIndex = user.gameBoard.board.indexOf(row);
            const colIndex = row.indexOf(col);

            const hitStatus = user.gameBoard.receiveAttack(rowIndex, colIndex);

            if (hitStatus === "hit") cell.style.background = "orange";
            if (hitStatus === "miss") cell.style.background = "gray";
            turn = turn == "Player" ? "Computer" : "Player";
            if (user.gameBoard.isAllSunk()) {
              map.style.background = "red";
              if (user.name === "Player") {
                endGame("Computer");
              } else {
                endGame("Player");
              }
            }
          }
          console.log(turn);
          if (turn === "Computer") {
            launchAttack(player);
            turn = turn == "Player" ? "Computer" : "Player";
          }
        });
      });
    });
  });

  const launchAttack = (target) => {
    const randomRow = Math.round(Math.random() * 9);
    const randomCol = Math.round(Math.random() * 9);

    const hitStatus = target.gameBoard.receiveAttack(randomRow, randomCol);
  };
};
