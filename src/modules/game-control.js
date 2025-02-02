import { Ship } from "./ship";
import { Player } from "./player";

function newGame() {
  // Create players
  const player = new Player("player");
  const computer = new Player("computer");

  // Reset Document Body
  document.body.innerHTML = " ";
  const placementScreen = document.createElement("div");
  placementScreen.id = "placement-screen";
  document.body.appendChild(placementScreen);

  const placeShips = () => {
    // Array of all potential battleships
    const ships = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Cruiser", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Destroyer", length: 2 },
    ];

    let shipIndex = 0;

    // Command Board
    const commandBoard = document.createElement("div");
    commandBoard.id = "command-board";
    commandBoard.innerHTML = `<div> Next Ship: </div>
      <div id=next-ship-indicator></div>`;
    placementScreen.append(commandBoard);

    const nextShip = document.getElementById("next-ship-indicator");
    nextShip.textContent = ships[shipIndex].name;

    // Tracker
    const tracker = document.createElement("div");
    tracker.textContent = JSON.stringify(player);

    // Placement Map
    const placementMap = document.createElement("div");
    placementMap.id = "placement-map";
    placementScreen.appendChild(placementMap);

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
            player.gameBoard.placeShip(newShip, rowIndex, colIndex);
            shipIndex++;
            if (ships[shipIndex]) nextShip.textContent = ships[shipIndex].name;

            tracker.textContent = JSON.stringify(player);
          }
        });
      });
    });

    placementScreen.appendChild(tracker);
  };

  return { placeShips }
}

const game = newGame();
game.placeShips();

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
