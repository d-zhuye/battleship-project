import { Ship } from "../modules/ship"

describe("Create a ship class", () => {
  test("ship class exists", () => {
    expect(Ship).toBeDefined();
  })

  const testShip = new Ship("cruiser", 3);
  test("creates new object with specified parameters", () => {
    expect(testShip.shipId).toBe("cruiser");
    expect(testShip.length).toBe(3);
  })
  test("Ship hitCount increases by 1 when hit", () => {
    testShip.hit();
    expect(testShip.hitCount).toBe(1);
    testShip.hit();
    testShip.hit();
    expect(testShip.hitCount).toBe(3);
  })
  test("ship status changed to sunken when hitPoint reaches 0", () => {
    expect(testShip.sunken).toBe(true);
  })
  describe("change ship position to specific coordinates with setCoords method", () => {
    const testCarrier = new Ship("carrier", 5);
    test("setCoords method exists", () => {
      expect(testCarrier.setCoords).toBeDefined();
    })
    test("ship should span its length given an horizontal orientation", () => {
      expect(testCarrier.orientation).toBe("horizontal");
      testCarrier.setCoords(6, 6);
      expect(testCarrier.rowPos).toEqual([6]);
      expect(testCarrier.colPos).toEqual([6, 7, 8, 9, 10]);
    })
    test("ship orientation should change when rotate method is called", () => {
      testCarrier.setOrientation("vertical");
      expect(testCarrier.orientation).toBe("vertical");    
    })
    test("ship should span its length when oriented vertically", () => {
      testCarrier.setCoords(4, 4);
      expect(testCarrier.rowPos).toEqual([4, 5, 6, 7, 8]);
      expect(testCarrier.colPos).toEqual([4]);
    })

    describe("ship should only be positioned if it fits in the 10x10 board", () => {
      const outOfBoundsMessage = "Ship out of bounds. Please reposition."
      test("setCoords method to throw error if ship will be out of bounds", () => {
        expect( () => testCarrier.setCoords(9, 9)).toThrow(outOfBoundsMessage)
      })
      test("setCoords method to throw error if ship, oriented vertically, will be out of bounds", () => {
        testCarrier.setOrientation("vertical");
        expect(() => testCarrier.setCoords(6, 7)).toThrow(outOfBoundsMessage)
        testCarrier.setOrientation("horizontal");
        expect( () => testCarrier.setCoords(3, 8)).toThrow(outOfBoundsMessage);
      })
    })
  })
})