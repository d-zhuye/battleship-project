class Ship {
  constructor(length) {
    this.length = length;
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
}
export { Ship };