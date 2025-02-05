import { Ship } from "./ship";
import { Player } from "./player";

const game = newGame();
game.placeShips();
game.placeRandom(game.computer);
game.renderMaps();

function newGame() {
  // Create players
  const player = new Player("player");
  const computer = new Player("computer");

  // Reset Document Body
  document.body.innerHTML = " ";
  const placementScreen = document.createElement("div");
  placementScreen.id = "placement-screen";
  document.body.appendChild(placementScreen);

  // Tracker
  const tracker = document.createElement("div");
  

  const ships = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 },
  ];

  const placeShips = () => {
    // Array of all potential battleships

    let shipIndex = 0;

    // Command Board
    const commandBoard = document.createElement("div");
    commandBoard.id = "command-board";
    commandBoard.innerHTML = `<div> Next Ship: </div>
      <div id=next-ship-indicator></div>`;
    placementScreen.append(commandBoard);

    const nextShip = document.getElementById("next-ship-indicator");
    nextShip.textContent = ships[shipIndex].name;

    // Placement Map
    const placementMap = document.createElement("div");
    placementMap.classList.add("map");
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
  };

  const placeRandom = (user) => {
    // Iterate over all ship objects stored in ships
    for (let i = 0; i < ships.length; i++) {
      const newShip = new Ship(ships[i].name, ships[i].length);
      let isPlaced = false;

      const constraint = 9 - newShip.length + 1; 

      while (!isPlaced) {
        newShip.orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
        const rowCoord = Math.round(Math.random() * constraint);
        const colCoord = Math.round(Math.random() * constraint);

        // Check all cells based on orientation
        const cells = [];
        console.log(newShip.orientation);
        for (let xy = 0; xy < newShip.length; xy++) {
          if (newShip.orientation == "vertical") {
            const cell = user.gameBoard.board[rowCoord + xy][colCoord];
            cells.push(cell);
          } else {
            const cell = user.gameBoard.board[rowCoord][colCoord + xy];
            cells.push(cell);
          }
        }

        // if (ship.orientation === "vertical") {
        //   console.log(ship.orientation);
        //   for (let y = 0; y < ship.length; y++) {
        //     const cell = computer.gameBoard.board[rowCoord][colCoord + y];
        //     cells.push(cell);
        //   }
        // } else {
        //   for (let x = 0; x < ship.length; x++) {
        //     const cell = computer.gameBoard.board[rowCoord + x][colCoord];
        //     cells.push(cell);
        //   }
        // }

        console.log("placing: " + newShip.shipId);
        cells.forEach(cell => {
          const stringify = JSON.stringify(cell);
          console.log(">>>>>>>" + stringify);
        })

        console.log(cells);
        console.log(newShip);
        let validity = cells.every(cell => cell.value === 0);

        console.log(validity);
        console.log("_____________________________________");

        if (validity) {
          user.gameBoard.placeShip(newShip, rowCoord, colCoord);
          isPlaced = true;
        } 
      }
    }
    tracker.textContent = JSON.stringify(user);
    placementScreen.appendChild(tracker);
  };

  const renderMaps = () => {
    [player, computer].forEach((user) => {
      const map = document.createElement("div");
      map.classList.add("map");
      placementScreen.appendChild(map);

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

export { newGame };
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
