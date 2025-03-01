export class MapGenerator {
  constructor(config) {
    this.maxPeaks = config.maxPeaks || 1;
    this.maximumElevation = config.maximumElevation || 1;
    this.rows = config.rows || 0;
    this.cols = config.cols || 0;
    this.isIslandMap = config.isIslandMap || false;
    this.tiles = this.createBasicTiles();
    this.colorMappings = this.setupColorMappings();
  }

  createMap = () => {
    // define place for each of the peaks
    for (let i = 0; i < this.maxPeaks; i++) {
      let randomX = 0;
      let randomY = 0;

      if (this.isIslandMap) {
        randomX = this.randomBetween(this.maximumElevation, this.cols - 1 - this.maximumElevation); // Ensure it does not exceed this.cols-1 and that the marginal tiles will be sea
        randomY = this.randomBetween(this.maximumElevation, this.rows - 1 - this.maximumElevation); // Ensure it does not exceed this.rows-1
      } else {
        randomX = this.randomBetween(0, this.cols - 1); // Ensure it does not exceed this.cols-1
        randomY = this.randomBetween(0, this.rows - 1); // Ensure it does not exceed this.rows-1
      }

      // guarrantees that 1st peak will be at max elevation, while the rest will be more random
      if (i == 0) {
        this.setElevation(this.maximumElevation, randomX, randomY);
      } else {
        this.setElevation(this.randomBetween(2, this.maximumElevation), randomX, randomY);
      }
    }
    this.tiles.forEach((tile) => this.setTileProperties(tile));
  };

  setElevation(maxElevation, x, y) {
    // Ensure that x and y are within bounds
    if (maxElevation <= 0 || x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
      return;
    }

    const tile = this.tiles.find((tile) => tile.x === x && tile.y === y);

    // If the tile does not exist, exit the function
    if (!tile) {
      return;
    }

    if (maxElevation >= tile.elevation) {
      tile.elevation = maxElevation;
    }

    if (maxElevation > 0) {
      // Get a random axis of expansion (horizontal/vertical or diagonal)
      let axis = this.getRandomBoolean();
      // expands on the horizontal-vertical axis
      if (axis) {
        this.setElevation(maxElevation - this.randomBetween(1, 2), x + 1, y);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x - 1, y);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x, y + 1);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x, y - 1);
      } else {
        // expands on diagonal
        this.setElevation(maxElevation - this.randomBetween(1, 2), x + 1, y + 1);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x - 1, y - 1);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x - 1, y + 1);
        this.setElevation(maxElevation - this.randomBetween(1, 2), x + 1, y - 1);
      }
    }
  }

  createBasicTiles = () => {
    const tiles = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const tile = { x: j, y: i, elevation: 0, fillColor: "", type: null };
        tiles.push(tile);
      }
    }
    return tiles;
  };

  randomBetween(min, max) {
    // Ensure the min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
    // Generate a random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomBoolean() {
    return Math.random() < 0.5; // Returns true if random number is less than 0.5, otherwise false
  }

  setupColorMappings(mapConfiguration = null) {
    const pathStone1 = "../assets/images/stone1.png";
    const pathStone2 = "../assets/images/stone2.png";
    const pathTree = "../assets/images/tree.png";
    const pathTree1 = "../assets/images/tree1.png";
    const pathTree2 = "../assets/images/tree2.png";
    const pathSea = "../assets/images/sea.jpg";
    const pathCastle = "../assets/images/castle.png";

    const defaultConfig = [
      //sea
      [0, ["blue", "lightblue", pathSea]],
      // beach- sand
      [1, ["wheat", "wheat", null]],
      // swamp
      [2, ["limegreen", "limegreen", pathTree2]],
      // valley
      [3, ["green", "green", null]],
      // forest
      [4, ["darkgreen", "darkgreen", pathTree1]],
      // hill
      [5, ["darkgray", "darkgray", pathStone1]],
      // mountain
      [6, ["lightgray", "lightgray", pathStone2]],
      //   [7, ["white", "white", pathCastle]],
    ];

    let mapConfig = mapConfiguration !== null ? mapConfiguration : defaultConfig;
    const colorMap = new Map(mapConfig);
    return colorMap;
  }

  setTileProperties = (tile) => {
    const tileVariables = this.colorMappings.get(tile.elevation);
    tile.fill = tileVariables[0];
    tile.line = tileVariables[1];
    tile.image = tileVariables[2];
  };

  getTileset = () => {
    return this.tiles;
  };
}
