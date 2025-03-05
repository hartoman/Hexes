import { shuffleArray ,randomBetween, randomBoolean} from "./helper-functions.js";

class MapGenerator {
  constructor(config) {
    this.maxPeaks = config.maxPeaks || 1;
    this.maximumElevation = config.maximumElevation || 1;
    this.minimumElevation = config.minimumElevation || -1
    this.rows = config.rows || 0;
    this.cols = config.cols || 0;
    this.isIslandMap = config.isIslandMap || false;
    this.tiles = this.createBasicTiles();
    this.colorScheme = null; 
    this.iconScheme = null;
  }

  createMap = () => {
    // define place for each of the peaks
    for (let i = 0; i < this.maxPeaks; i++) {
      let randomX = 0;
      let randomY = 0;

      if (this.isIslandMap) {
        randomX = randomBetween(this.maximumElevation, this.cols - 1 - this.maximumElevation); // Ensure it does not exceed this.cols-1 and that the marginal tiles will be sea
        randomY = randomBetween(this.maximumElevation, this.rows - 1 - this.maximumElevation); // Ensure it does not exceed this.rows-1
      } else {
        randomX = randomBetween(0, this.cols - 1); // Ensure it does not exceed this.cols-1
        randomY = randomBetween(0, this.rows - 1); // Ensure it does not exceed this.rows-1
      }

      // guarrantees that 1st peak will be at max elevation, while the rest will be more random
      if (i == 0) {
        this.setElevation(this.maximumElevation, randomX, randomY);
      } else {
        this.setElevation(randomBetween(1, this.maximumElevation), randomX, randomY);
      }
    }
    this.tiles.forEach((tile) => this.setTileProperties(tile));
  };

  setElevation(maxElevation, x, y, depth = 0, visited = new Set()) {
    const MAX_DEPTH = 100; // Set a maximum recursion depth  
    // Ensure that x and y are within bounds
    if (maxElevation <= this.minimumElevation || x < 0 || x >= this.cols || y < 0 || y >= this.rows || depth > MAX_DEPTH) {
      return;
    }  
    const tile = this.tiles.find((tile) => tile.x === x && tile.y === y);    
    // If the tile does not exist or has already been visited, exit the function
    if (!tile || visited.has(`${x},${y}`)) {
      return;
    }
  
    // Mark the tile as visited
 //   visited.add(`${x},${y}`);
    tile.elevation = maxElevation;

    if (maxElevation > this.minimumElevation) {
      const neighbors = this.getNeighborTiles(tile);
      shuffleArray(neighbors)
      neighbors.forEach(neighbor => {
        const newElevation = maxElevation-randomBetween(1,2) // 1;
        // Only recurse if the neighbor's elevation is less than the current elevation
        if ( newElevation > neighbor.elevation) {
          this.setElevation(newElevation, neighbor.x, neighbor.y, depth + 1, visited);
        }
      });
    }
  }
  
  getNeighborTiles = (tile) => {
    
    // odd-numbered
    if (tile.x % 2 === 1) {
      return this.tiles.filter(neighbortile =>
        neighbortile.x === tile.x && neighbortile.y === tile.y-1 ||
        neighbortile.x === tile.x+1 && neighbortile.y === tile.y ||
        neighbortile.x === tile.x-1 && neighbortile.y === tile.y ||
        neighbortile.x === tile.x && neighbortile.y === tile.y+1 ||
        neighbortile.x === tile.x-1 && neighbortile.y === tile.y+1 ||
        neighbortile.x === tile.x+1 && neighbortile.y === tile.y+1
      )
    }

    // even-numbered
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
        const tile = { x: j, y: i, elevation: this.minimumElevation, fillColor: "", type: null };
        tiles.push(tile);
      }
    }
    return tiles;
  };

  setTileProperties = (tile) => {
   // tile.icon = 'mountain'
  };

  setTileTerrain = (tile) => {
    
  }

  getTiles = () => {
    return this.tiles;
  };
}
export default MapGenerator;