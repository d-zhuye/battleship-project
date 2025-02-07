import { Player } from "./classes/player";
import { newGame } from "./game-set-up";

let player, computer;
let gamePlay;
initializeGamePlay();

function initializeGamePlay() {
  player = new Player("Player");
  computer = new Player("Computer");

  document.body.innerHTML = " ";
  gamePlay = document.createElement("div");
  gamePlay.id = "game-play";
  document.body.appendChild(gamePlay);

  const setup = newGame();
  setup.placeShips();
  setup.placeRandom(computer);
}

export { initializeGamePlay, player, computer, gamePlay };
