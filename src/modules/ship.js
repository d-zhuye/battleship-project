class Ship {
  constructor(shipId, length) {
    this.shipId = shipId;
    this.length = length;
    this.orientation = "horizontal";
    this.rowPos;
    this.colPos;
    this.hitCount = 0;
    this.sunken = false;
  }

  hit() {
    this.hitCount++;
    this.isSunk();
  }

  isSunk() {
    if (this.hitCount === this.length) {
      this.sunken = true;
    }
  }
  
  setCoords(row, col) {
    this.rowPos = [];
    this.colPos = [];

    this.checkBounds(row, col);

    if (this.orientation === "horizontal") {
      for(let i = 0; i < this.length; i++) {
        this.colPos.push(col + i);
      }
      this.rowPos.push(row);
    } 

    if (this.orientation === "vertical") {
      for (let i = 0; i < this.length; i++) {
        this.rowPos.push(row + i);
      }
      this.colPos.push(col);
    }
  }

  checkBounds(row, col) {
    const verticalBound = 9 - this.length;
    if (row < 0 || verticalBound > 9) { 
      throw new Error("Ship out of bounds. Please reposition.")
    }

    const horizontalBound = 9 - this.length;
    if (col < 0 || horizontalBound > 9) {
      throw new Error("Ship out of bounds. Please reposition.")
    }
  }

  setOrientation(orientation) {
    this.orientation = orientation;
  }
}
export { Ship };