import { Ship } from "./classes/ship";
import { gamePlay } from "./game-control";
import { startBattle } from "./active-battle";
import { player, computer } from "./game-control";

// Note to self! Players are able to place ships below lower boundary.
// Reconfigure isValidPlacement to prevent behavior.

export function newGame() {
    const ships = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Cruiser", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Destroyer", length: 2 },
    ];
  
    const placeShips = () => {
      let shipIndex = 0;
      let currOrientation = "horizontal";
      let newShip;
  
      // Placement Map
      const placementMap = document.createElement("div");
      placementMap.classList.add("map");
      gamePlay.appendChild(placementMap);
  
      const commandBoard = createCommandBoard(gamePlay);
      const nextShip = commandBoard.nextShip;
      const orientationBtn = commandBoard.orientationBtn;
      const resetBtn = commandBoard.resetBtn;
  
      orientationBtn.addEventListener("click", () => {
        if (currOrientation == "horizontal") {
          newShip.orientation = currOrientation = "vertical";
          orientationBtn.textContent = "Vertical";
        } else {
          newShip.orientation = currOrientation = "horizontal";
          orientationBtn.textContent = "Horizontal";
        }
      });
  
      resetBtn.addEventListener("click", () => {
        commandBoard.lowerCommandBoard.classList.remove("hidden");
  
        commandBoard.confirmResetBtn.addEventListener("click", () => {
          commandBoard.lowerCommandBoard.classList.add("hidden");
          player.gameBoard.resetBoard();
          shipIndex = 0;
          placementMap.innerHTML = "";
          generatePlacementMap();
        });
  
        commandBoard.cancelResetBtn.addEventListener("click", () => {
          commandBoard.lowerCommandBoard.classList.add("hidden");
        });
      });
  
      generatePlacementMap();
      function generatePlacementMap() {
        newShip = new Ship(
          ships[shipIndex].name,
          ships[shipIndex].length,
          currOrientation
        );
  
        if (ships[shipIndex]) {
          //Orientation 2: ship created with specified orientation
          nextShip.innerHTML = "";
  
          for (let len = 0; len < newShip.length; len++) {
            const lenDisplay = document.createElement("div");
            lenDisplay.classList.add("length-display");
            nextShip.appendChild(lenDisplay);
          }
        }
  
        player.gameBoard.board.forEach((row) => {
          row.forEach((col) => {
            // Creates individual cells
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (col.value && col.ship) cell.classList.add("placed-ship");
            placementMap.appendChild(cell);
  
            let cellArray = [];
            let validity;
  
            cell.addEventListener("mouseover", showPrePlacement);
  
            cell.addEventListener("mouseleave", () => {
              cell.id = "";
              cellArray.forEach((c) => {
                c.classList.remove("hover-placement");
                c.classList.remove("invalid-hover-placement");
              });
              cellArray = [];
            });
  
            cell.addEventListener("click", attemptPlacement);
  
            function showPrePlacement() {
              cell.id = "mouseover-cell";
              const allCells = Array.from(document.querySelectorAll(".cell"));
              const cellIndex = allCells.findIndex(
                (c) => c.id === "mouseover-cell"
              );
              const rowIndex = player.gameBoard.board.indexOf(row);
              const colIndex = row.indexOf(col);
              validity = isValidPlacement(newShip, player, rowIndex, colIndex);
  
              let barrier;
              if (newShip.orientation === "horizontal") {
                if (cellIndex % 10 > 5) barrier = Math.round(cellIndex / 10) * 10;
                for (let l = 0; l < newShip.length; l++) {
                  const nextIndex = cellIndex + l;
                  if (!barrier || nextIndex < barrier)
                    cellArray.push(allCells[nextIndex]);
                }
              } else {
                barrier = 90 + colIndex;
                for (let l = 0; l < newShip.length; l++) {
                  const nextIndex = cellIndex + l * 10;
                  if (!barrier || nextIndex <= barrier)
                    cellArray.push(allCells[nextIndex]);
                }
              }
  
              cellArray.forEach((c) => {
                if (validity && cellArray.length == newShip.length)
                  c.classList.toggle("hover-placement");
                if (!validity || cellArray.length != newShip.length)
                  c.classList.toggle("invalid-hover-placement");
              });
            }
  
            function attemptPlacement() {
              if (shipIndex < ships.length) {
                const rowIndex = player.gameBoard.board.indexOf(row);
                const colIndex = row.indexOf(col);
  
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
  
                if (shipIndex == ships.length) {
                  startBattle(player, computer);
                  return;
                } 
  
                if (validity) {
                  placementMap.innerHTML = "";
                  generatePlacementMap();
                }
              }
            }
          });
        });
      }
    };
  
    const placeRandom = (user) => {
      for (let i = 0; i < ships.length; i++) {
        const newShip = new Ship(ships[i].name, ships[i].length);
        let isPlaced = false;
  
        const constraint = 9 - newShip.length + 1;
        newShip.orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
  
        while (!isPlaced) {
          let rowCoord, colCoord;
          if (newShip.orientation == "vertical") {
            rowCoord = Math.round(Math.random() * constraint);
            colCoord = Math.round(Math.random() * 9);
          } else {
            colCoord = Math.round(Math.random() * constraint);
            rowCoord = Math.round(Math.random() * 9);
          }
  
          let validity = isValidPlacement(
            newShip,
            user,
            rowCoord,
            colCoord,
            true
          );
  
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
        if (
          ship.orientation == "vertical" &&
          user.gameBoard.board[rowCoord + xy]
        ) {
          const cell = user.gameBoard.board[rowCoord + xy][colCoord];
          cells.push(cell);
  
          if (isRandom) {
            if (user.gameBoard.board[rowCoord + xy][colCoord + 1]) {
              const marginRight =
                user.gameBoard.board[rowCoord + xy][colCoord + 1];
              cells.push(marginRight);
            }
  
            if (user.gameBoard.board[rowCoord + xy][colCoord - 1]) {
              const marginLeft =
                user.gameBoard.board[rowCoord + xy][colCoord - 1];
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
              const marginBottom =
                user.gameBoard.board[rowCoord - 1][colCoord + xy];
              cells.push(marginBottom);
            }
          }
        }
      }
  
      let validity = cells.every((cell) => cell && cell.value === 0);
      return validity;
    };
    return { player, computer, placeShips, placeRandom, startBattle };
  }

  function createCommandBoard(parentContainer) {
    const commandBoard = document.createElement("div");
    commandBoard.id = "command-board";
    commandBoard.innerHTML = `<div id="upper-cb">
          <div class="cb-text">Next Ship</div>
          <div id="next-ship"></div>
        </div>
        <div id="mid-cb">
          <div class="cb-text">Orientation</div>
          <div id="mid-btns"><button id="orientation-btn">Horizontal</button>
                  <button id="reset-btn">Reset</button></div>
          
        </div>
        <div id="lower-cb" class="hidden">
          Resetting Ship Placement...
          <button id="cancel-reset-btn">Cancel</button>
          <button id="confirm-reset-btn">Confirm</button> 
  
        </div>`;
    parentContainer.append(commandBoard);
  
    const nextShip = document.getElementById("next-ship");
    const orientationBtn = document.getElementById("orientation-btn");
    const resetBtn = document.getElementById("reset-btn");
    const lowerCommandBoard = document.getElementById("lower-cb");
    const cancelResetBtn = document.getElementById("cancel-reset-btn");
    const confirmResetBtn = document.getElementById("confirm-reset-btn");
  
    return {
      commandBoard,
      nextShip,
      orientationBtn,
      resetBtn,
      lowerCommandBoard,
      cancelResetBtn,
      confirmResetBtn,
    };
  }
  