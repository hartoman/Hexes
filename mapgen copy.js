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
        this.setElevation(this.randomBetween(1, this.maximumElevation), randomX, randomY);
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

    if (maxElevation > tile.elevation) {
      tile.elevation = maxElevation;
    } 

    if (maxElevation > 0) {
      const neighbors = this.getNeighborTiles(tile);  
      neighbors.forEach(neighbor => {
   //    const newElevation = this.randomBetween(2, 12) > 2 ? this.randomBetween(1, 2) : 0;
        const newElevation = this.randomBetween(1, 2)
        this.setElevation(maxElevation - newElevation, neighbor.x, neighbor.y)
      })
    }
  }

  getNeighborTiles=(tile)=> {
    return this.tiles.filter(neighbortile =>
      neighbortile.x === tile.x && neighbortile.y === tile.y-1 ||
      neighbortile.x === tile.x+1 && neighbortile.y === tile.y-1 ||
      neighbortile.x === tile.x-1 && neighbortile.y === tile.y-1 ||
      neighbortile.x === tile.x && neighbortile.y === tile.y+1 ||
      neighbortile.x === tile.x-1 && neighbortile.y === tile.y ||
      neighbortile.x === tile.x+1 && neighbortile.y === tile.y
    )
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
      const pathSea = "../assets/svgs/sea color.svg";      
      const pathWasteland = "../assets/svgs/wasteland color.svg";
      const pathSwamp = "../assets/svgs/swamp color.svg";
    const pathForest = "../assets/svgs/forest color.svg";
    const pathHill = "../assets/svgs/hill color.svg";
    const pathMountain = "../assets/svgs/mountain color.svg";

  //  const pathCastle = "../assets/svgs/castle.png";

    const defaultConfig = [
      // sea
      [0, ["DeepSkyBlue", "lightblue", null]],
      // wasteland
      [1, ["wheat", "wheat", pathWasteland]],
      // swamp
      [2, ["DarkSeaGreen", "DarkSeaGreen", pathSwamp]],
      // valley
      [3, ["lightgreen", "lightgreen", null]],
      // forest
      [4, ["ForestGreen", "ForestGreen", pathForest]],
      // hill
      [5, ["darkgray", "darkgray", pathHill]],
      // mountain
      [6, ["gray", "gray", pathMountain]],
      
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
