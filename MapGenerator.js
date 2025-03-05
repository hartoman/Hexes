export class MapGenerator {
  constructor(config) {
    this.maxPeaks = config.maxPeaks || 1;
    this.maximumElevation = config.maximumElevation || 1;
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

  setElevation(maxElevation, x, y, depth = 0, visited = new Set()) {
    const MAX_DEPTH = 100; // Set a maximum recursion depth
  
    // Ensure that x and y are within bounds
    if (maxElevation <= 0 || x < 0 || x >= this.cols || y < 0 || y >= this.rows || depth > MAX_DEPTH) {
      return;
    }
  
    const tile = this.tiles.find((tile) => tile.x === x && tile.y === y);
    
    // If the tile does not exist or has already been visited, exit the function
    if (!tile || visited.has(`${x},${y}`)) {
      return;
    }
  
    // Mark the tile as visited
    visited.add(`${x},${y}`);
    tile.elevation = maxElevation;

    if (maxElevation > 0) {
      const neighbors = this.getNeighborTiles(tile);
      this.shuffleArray(neighbors)
      neighbors.forEach(neighbor => {
        const newElevation = maxElevation-this.randomBetween(1, 2);
        // Only recurse if the neighbor's elevation is less than the current elevation
        if ( newElevation > neighbor.elevation) {
          this.setElevation(newElevation, neighbor.x, neighbor.y, depth + 1, visited);
        }
      });
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

  setupColorScheme=(colorScheme = null) =>{
    const colorMap = new Map(colorScheme);
    this.colorScheme= colorMap;
  }

  setupIconScheme = (iconScheme = null) => {
    const iconMap = new Map(iconScheme);
    this.iconScheme= iconMap;  
  }

  setTileProperties = (tile) => {
    this.setTileColor(tile)
    this.setTileImage(tile)
  };

  setTileColor = (tile) => {
    const colors = this.colorScheme.get(tile.elevation);
    tile.fill = colors[0];
    tile.line = colors[1];
  }

  setTileImage = (tile) => {
    const icons = this.iconScheme.get(tile.elevation);
    tile.image = icons;
  }

  getTiles = () => {
    return this.tiles;
  };

  shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
}
