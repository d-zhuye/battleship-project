import { Ship } from "./ship";
import { Player } from "./player";

initializeGamePlay();

function initializeGamePlay() {
  const game = newGame();
  game.placeShips();
  game.placeRandom(game.computer);
  // game.renderMaps();
}

function newGame() {
  // Create players
  const player = new Player("Player");
  const computer = new Player("Computer");

  // Reset Document Body
  document.body.innerHTML = " ";
  const gamePlay = document.createElement("div");
  gamePlay.id = "game-play";
  document.body.appendChild(gamePlay);

  const commandBoard = createCommandBoard(gamePlay);
  const nextShip = commandBoard.nextShip;
  const orientationBtn = commandBoard.orientationBtn;

  const ships = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 },
  ];

  const placeShips = () => {
    // Placement Map
    const placementMap = document.createElement("div");
    placementMap.classList.add("map");
    gamePlay.appendChild(placementMap);

    let shipIndex = 0;
    let currOrientation = "horizontal";
    let newShip;

    orientationBtn.addEventListener("click", () => {
      if (currOrientation == "horizontal") {
        newShip.orientation = currOrientation = "vertical";
        orientationBtn.textContent = "Vertical";
      } else {
        newShip.orientation = currOrientation = "horizontal";
        orientationBtn.textContent = "Horizontal";
      }
    });

    (function generatePlacementMap() {
      newShip = new Ship(
        ships[shipIndex].name,
        ships[shipIndex].length,
        currOrientation
      );
  
      if (ships[shipIndex]) {
        console.log(currOrientation);
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
            console.log("working");
            cell.id = "mouseover-cell";
            const allCells = Array.from(document.querySelectorAll(".cell"));
            const cellIndex = allCells.findIndex(
              (c) => c.id === "mouseover-cell"
            );
            const rowIndex = player.gameBoard.board.indexOf(row);
            const colIndex = row.indexOf(col);
            validity = isValidPlacement(newShip, player, rowIndex, colIndex);

            console.log(cellIndex);
            let barrier;
            console.log(newShip.orientation);
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
                placementMap.innerHTML = "";
              }

              if (shipIndex == ships.length) {
                console.log("starting battle");
                startBattle();
                return;
              } else {
                generatePlacementMap();
              }
            }
          }
        });
      });
    })();
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

  const startBattle = () => {
    gamePlay.innerHTML = "";

    let turn = "Player";
    const turnIndicator = document.createElement("div");
    turnIndicator.textContent = turn;
    gamePlay.appendChild(turnIndicator);

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

              const hitStatus = user.gameBoard.receiveAttack(
                rowIndex,
                colIndex
              );

              if (hitStatus === "hit") cell.style.background = "orange";
              if (hitStatus === "miss") cell.style.background = "gray";
              turn = turn == "Player" ? "Computer" : "Player";
              turnIndicator.textContent = turn;
              if (user.gameBoard.isAllSunk()) map.style.background = "red";
            }
          });
        });
      });
    });
  };
  return { player, computer, placeShips, placeRandom, startBattle };
}

function createCommandBoard(parentContainer) {
  const commandBoard = document.createElement("div");
  commandBoard.id = "command-board";
  commandBoard.innerHTML = `<div id="left-cb">
        <div class="cb-text">Next Ship</div>
        <div id="next-ship"></div>
      </div>
      <div id="mid-cb">
        <div class="cb-text">Orientation</div>
        <button id="orientation-btn">Horizontal</button>
      </div>
      <div id="right-cb">
        <button id="random-btn">Randomize</button>
        <button id="reset-btn">Reset</button>
      </div>`;
  parentContainer.append(commandBoard);

  const nextShip = document.getElementById("next-ship");
  const orientationBtn = document.getElementById("orientation-btn");

  return { commandBoard, nextShip, orientationBtn };
}

export { initializeGamePlay };
