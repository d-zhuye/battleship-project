import { gamePlay } from "./game-control";

export function endGame(user) {
  gamePlay.innerHTML = "";

  const result = document.createElement("div");
  gamePlay.appendChild(result);

  if (user === "Player") {
    result.textContent = "Congratulations!";
  } else {
    result.textContent = "Defeat";
  }
}
