import { template } from "@babel/core";
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
      const expectedCell = {value: 0, ship: null, hit: false};
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

describe("GameBoard object to properly manage ships", () => {
  const testBoard2 = new GameBoard();
  describe("GameBoard to set coordinates of ships and update graph accordingly", () => {
    test("GameBoard to set coordinates of ships", () => {
      testBoard2.placeShip(testBoard2.submarine, 3, 7);
      expect(testBoard2.submarine.rowPos).toEqual([3]);
      expect(testBoard2.submarine.colPos).toEqual([7, 8, 9]);
    })
    test("placeShip method to throw error if ship is out of bound", () => {
      expect(() => testBoard2.placeShip(testBoard2.battleship, 8, 8)).toThrow("Ship out of bounds. Please reposition.");
      expect(testBoard2.board[9][9].value).toBe(0);
      expect(testBoard2.board[8][8].ship).toBe(null);
    })
    test("Setting ship coordinates should change corresponding cell values to 1  and shipId", () => {
      const expected = { value: 1, ship: testBoard2.submarine, hit: false}
      expect(testBoard2.board[3][7]).toEqual(expected);
      expect(testBoard2.board[3][8]).toEqual(expected);
      expect(testBoard2.board[3][9]).toEqual(expected);
    })
  })
  describe("when cell with ship is hit, cell hit property and ship hit count  will change", () => {
    const testBoard3 = new GameBoard();
    testBoard3.placeShip(testBoard3.destroyer, 4, 4);
    testBoard3.receiveAttack(4, 4);
    test("cell hit property will change to hit", () => {
      const expected = { value: 1, ship: testBoard3.destroyer, hit: "hit" }
      expect(testBoard3.board[4][4]).toEqual(expected);
    })
    test("ship hit count increase by 1 when receiveAttack successfully hits", () => {
      expect(testBoard3.destroyer.hitCount).toBe(1);
    })
    test("ship sunken status changed to true when hitCount equal length", () => {
      testBoard3.receiveAttack(4, 5);
      expect(testBoard3.destroyer.hitCount).toBe(2);
      expect(testBoard3.destroyer.sunken).toBe(true);
    })
  })
})