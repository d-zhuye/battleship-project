import { Ship } from "./ship";
import { Player } from "./player";

initializeGamePlay();

function initializeGamePlay() {
  const game = newGame();
  game.placeShips();
  game.placeRandom(game.computer);
  game.renderMaps();
}

function newGame() {
  // Create players
  const player = new Player("player");
  const computer = new Player("computer");

  // Reset Document Body
  document.body.innerHTML = " ";
  const gamePlay = document.createElement("div");
  gamePlay.id = "placement-screen";
  document.body.appendChild(gamePlay);

  const ships = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 },
  ];

  const placeShips = () => {
    let shipIndex = 0;

    // Command Board
    const commandBoard = document.createElement("div");
    commandBoard.id = "command-board";
    commandBoard.innerHTML = `<div> Next Ship: </div>
      <div id=next-ship-indicator></div>`;
      gamePlay.append(commandBoard);

    const nextShip = document.getElementById("next-ship-indicator");
    nextShip.textContent = ships[shipIndex].name;

    // Placement Map
    const placementMap = document.createElement("div");
    placementMap.classList.add("map");
    gamePlay.appendChild(placementMap);

    player.gameBoard.board.forEach((row) => {
      row.forEach((col) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = col.value;
        placementMap.appendChild(cell);

        cell.addEventListener("click", () => {
          if (shipIndex < ships.length) {
            const rowIndex = player.gameBoard.board.indexOf(row);
            const colIndex = row.indexOf(col);

            const newShip = new Ship(
              ships[shipIndex].name,
              ships[shipIndex].length
            );

            const validity = isValidPlacement(
              newShip,
              player,
              rowIndex,
              colIndex
            );

            if (validity) {
              player.gameBoard.placeShip(newShip, rowIndex, colIndex);
              shipIndex++;
            }
            if (ships[shipIndex]) nextShip.textContent = ships[shipIndex].name;
            if (shipIndex == ships.length) renderMaps();
          }
        });
      });
    });
  };

  const placeRandom = (user) => {
    // Iterate over all ship objects stored in ships
    for (let i = 0; i < ships.length; i++) {
      const newShip = new Ship(ships[i].name, ships[i].length);
      let isPlaced = false;

      const constraint = 9 - newShip.length + 1;

      while (!isPlaced) {
        newShip.orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
        let rowCoord, colCoord;
        if (newShip.orientation == "vertical") {
          rowCoord = Math.round(Math.random() * constraint);
          colCoord = Math.round(Math.random() * 9);
        } else {
          colCoord = Math.round(Math.random() * constraint);
          rowCoord = Math.round(Math.random() * 9);
        }

        let validity = isValidPlacement(newShip, user, rowCoord, colCoord, true);

        if (validity) {
          user.gameBoard.placeShip(newShip, rowCoord, colCoord);
          isPlaced = true;
        }
      }
    }
  };

  const isValidPlacement = (ship, user, rowCoord, colCoord, isRandom) => {
    const cells = [];
    for (let xy = 0; xy < ship.length; xy++) {
      if (ship.orientation == "vertical") {
        const cell = user.gameBoard.board[rowCoord + xy][colCoord];
        cells.push(cell);

        if (isRandom) {
          if (user.gameBoard.board[rowCoord + xy][colCoord + 1]) {
            const marginRight = user.gameBoard.board[rowCoord + xy][colCoord + 1];
            cells.push(marginRight);
          }

          if (user.gameBoard.board[rowCoord + xy][colCoord - 1]) {
            const marginLeft = user.gameBoard.board[rowCoord + xy][colCoord - 1];
            cells.push(marginLeft);
          }
        }
      } else {
        const cell = user.gameBoard.board[rowCoord][colCoord + xy];
        cells.push(cell);

        if (isRandom) {
          if (user.gameBoard.board[rowCoord + 1]) {
            const marginTop = user.gameBoard.board[rowCoord + 1][colCoord + xy];
            cells.push(marginTop);
          }

          if (user.gameBoard.board[rowCoord - 1]) {
            const marginBottom = user.gameBoard.board[rowCoord - 1][colCoord + xy];
            cells.push(marginBottom);
          }
        }
      }
    }

    let validity = cells.every((cell) => cell && cell.value === 0);
    return validity;
  };

  const renderMaps = () => {
    gamePlay.innerHTML = "";
    [player, computer].forEach((user) => {
      const map = document.createElement("div");
      map.classList.add("map");
      gamePlay.appendChild(map);

      user.gameBoard.board.forEach((row) => {
        row.forEach((col) => {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          if (col.ship) cell.textContent = col.ship.shipId;

          map.appendChild(cell);
        });
      });
    });
  };

  return { player, computer, placeShips, placeRandom, renderMaps };
}

export { initializeGamePlay };
/*
  1. Reset document body
  2. Create ship placement screen
  3. Display ships in order and allow player to position
  4. Player will be able to toggle the orientation of ships between vertical and horizontal
  5. Validity Parameters:
    (a) ship remains inside map
    (b) coordinates does not already contain another ship/object

    Example: 
      If coordinates are valid, then create corresponding ship object &&
      push ship into respective gameBoard fleet array. 

      If coordinates are invalid, then prompt users to select another location.

*/