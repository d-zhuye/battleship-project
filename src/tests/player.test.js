import { Player } from "../modules/player";

describe("Player class creates and properly manages game boards", () => {
  test("player class exists", () => {
    expect(Player).toBeDefined();
  })

  const testPlayer = new Player("Jane");
  test("Player class constructs and stores playerId", () => {
    expect(testPlayer.playerName).toBe("Jane");
  })
  describe("Player class creates, stores, and manages game board", () => {
    expect(testPlayer.gameBoard).toBeDefined();
    
  })
})