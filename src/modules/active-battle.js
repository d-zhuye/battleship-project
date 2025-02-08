import { gamePlay } from "./game-control";
import { player, computer } from "./game-control";
import { endGame } from "./end-game";

let turn = "Player";
let activeMaps;

export const startBattle = () => {
  gamePlay.innerHTML = "";

  activeMaps = document.createElement("div");
  activeMaps.id = "active-maps";
  gamePlay.appendChild(activeMaps);

  generateActiveMaps();
};

function generateActiveMaps() {
  activeMaps.innerHTML = "";
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

        if (col.hit === "miss") cell.style.background = "gray";
        if (col.ship && col.ship.sunken) {
          cell.style.background = "red";
        } else if (col.hit === "hit") {
          cell.style.background = "orange";
        }

        map.appendChild(cell);

        cell.addEventListener("click", () => {
          if (col.hit == false && turn != user.name) {
            const rowIndex = user.gameBoard.board.indexOf(row);
            const colIndex = row.indexOf(col);

            user.gameBoard.receiveAttack(rowIndex, colIndex);
            generateActiveMaps();
            turn = turn == "Player" ? "Computer" : "Player";
          }
          if (turn === "Computer") {
            launchAttack(player);
            turn = turn == "Player" ? "Computer" : "Player";
          }
          isGameOver();
          
        });
      });
    });
  });
}

let focusedTarget;
function launchAttack() {
  let rowCoord, colCoord;
  if (focusedTarget) {
    const index = Math.round(
      Math.random() * (focusedTarget.targets.length - 1)
    );
    let nextTarget = focusedTarget.targets[index];
    focusedTarget.focusDirection = nextTarget.direction;
    focusedTarget.targets.splice(index, 1);
    rowCoord = nextTarget.row;
    colCoord = nextTarget.col;
  } else {
    rowCoord = Math.round(Math.random() * 9);
    colCoord = Math.round(Math.random() * 9);
  }

  if (!player.gameBoard.board[rowCoord][colCoord].hit) {
    let hitStatus = player.gameBoard.receiveAttack(rowCoord, colCoord);
    let shipExists, shipSunken;

    shipExists = player.gameBoard.board[rowCoord][colCoord].ship;
    if (shipExists) shipSunken = shipExists.sunken;

    if (shipExists && shipSunken) {
      focusedTarget = undefined;
    } else if (hitStatus == "hit") {
      if (!focusedTarget) {
        focusedTarget = {
          focusRow: rowCoord,
          focusCol: colCoord,
          focusDirection: undefined,
          targets: [],
        };
      }

      let possibleTargets;
      if (focusedTarget.focusDirection === "vert") {
        possibleTargets = [
          { row: rowCoord + 1, col: colCoord, direction: "vert" },
          { row: rowCoord - 1, col: colCoord, direction: "vert" },
        ];
      } else if (focusedTarget.focusDirection === "hori") {
        possibleTargets = [
          { row: rowCoord, col: colCoord + 1, direction: "hori" },
          { row: rowCoord, col: colCoord - 1, direction: "hori" },
        ];
      } else {
        possibleTargets = [
          { row: rowCoord + 1, col: colCoord, direction: "vert" },
          { row: rowCoord - 1, col: colCoord, direction: "vert" },
          { row: rowCoord, col: colCoord + 1, direction: "hori" },
          { row: rowCoord, col: colCoord - 1, direction: "hori" },
        ];
      }

      possibleTargets.forEach((target) => {
        if (target.row >= 0 && target.row <= 9) {
          if (target.col >= 0 && target.col <= 9) {
            focusedTarget.targets.push(target);
          }
        }
      });
    }
    generateActiveMaps();
    return;
  } else {
    launchAttack();
  }
  isGameOver()
}

function isGameOver() {
  if (player.gameBoard.isAllSunk()) endGame("Computer");
  if (computer.gameBoard.isAllSunk()) endGame("Player");
}