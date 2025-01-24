import { GameBoard } from "../modules/game-board";

describe("create a 10x10 game board", () => {
  test("GameBoard class exists", () => {
    expect(GameBoard).toBeDefined();
  })

  const testBoard = new GameBoard();
  describe("createBoard returns a 10x10 adjacency grid", () => {
    test("gameBoard contains 10 rows / arrays", () => {
      expect(testBoard.board.length).toBe(10);
    })
    test("all 10 rows contains 10 arrays each with stored object", () => {
      const expectedCell = {value: 0, shipId: null, hit: false};
      testBoard.board.forEach(row => {
        expect(row.length).toBe(10);

        row.forEach(col => {
          expect(col).toEqual(expectedCell);
        })
      }) 
    })
  })
  describe("store ship pieces with appropriate lengths in constructor", () => {
    test("contains carrier Ship with length of 5", () => {
      expect(testBoard.carrier).toBeDefined();
      expect(testBoard.carrier.shipId).toBe("carrier");
      expect(testBoard.carrier.length).toBe(5);
    })
    test("contains battleship Ship with length of 4", () => {
      expect(testBoard.battleship).toBeDefined();
      expect(testBoard.battleship.shipId).toBe("battleship");
      expect(testBoard.battleship.length).toBe(4);
    })
    test("contains cruiser Ship with length of 3", () => {
      expect(testBoard.cruiser).toBeDefined();
      expect(testBoard.cruiser.shipId).toBe("cruiser");
      expect(testBoard.cruiser.length).toBe(3);
    })
    test("contains submarine Ship with length of 3", () => {
      expect(testBoard.submarine).toBeDefined();
      expect(testBoard.submarine.shipId).toBe("submarine");
      expect(testBoard.submarine.length).toBe(3);
    })
    test("contains destroyer Ship with length of 3", () => {
      expect(testBoard.destroyer).toBeDefined();
      expect(testBoard.destroyer.shipId).toBe("destroyer");
      expect(testBoard.destroyer.length).toBe(2);
    })
  })
  describe("change cell hit status to miss if targeted with receiveAttack", () => {
    test("receiveAttack function exists", () => {
      expect(testBoard.receiveAttack).toBeDefined();
    })
    test("targeted cell hit status chanted to miss", () => {
      testBoard.receiveAttack(5, 5);
      expect(testBoard.board[5][5].hit).toBe("miss");
    })
  })
})