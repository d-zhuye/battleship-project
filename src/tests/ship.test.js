import { Ship } from "../modules/ship"

describe.only("Create a ship class", () => {
  test("ship class exists", () => {
    expect(Ship).toBeDefined();
  })
  test("creates new object with specified parameters", () => {
    const testShip = new Ship(3);
    expect(testShip.length).toBe(3);
  })
  test("Ship hitCount increases by 1 when hit", () => {
    const testShip = new Ship(3);
    testShip.hit();
    expect(testShip.hitCount).toBe(1);
    testShip.hit();
    testShip.hit();
    expect(testShip.hitCount).toBe(3);
  })
  test("ship status changed to sunken when hitPoint reaches 0", () => {
    const testShip = new Ship(1);
    testShip.hit();
    expect(testShip.sunken).toBe(true);
  })
})