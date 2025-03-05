class HexGrid {
  constructor (el, config) {    
    this.config = config;
    this.hasCoordinates = true;
    this.canvas =document.getElementById(el) 
    this.ctx = this.canvas.getContext("2d");
    this.rows = config.rows;
    this.columns = config.columns;
    this.circumradius = config.radius;
    this.apothem = this.circumradius * (Math.sqrt(3) / 2); // the height difference of odd-numbered cells
    this.edge = Math.sqrt(3) * this.circumradius * Math.cos(Math.PI / 6);
    this.angle = Math.PI / 3;
    this.startingX = this.config.startCenterX ? 0 : this.circumradius; // grid starts from centerX of first hex. zero value means start from top
    this.startingY = this.config.startCenterY ? 0 : this.apothem; // grid starts from left corner of first hex. zero value means start from centerY
    this.imageCache = {};

    this.initialize()
  }

  #normalizeCanvas() {
    const canvasWidth = this.columns * this.edge - (this.edge - 2 * this.startingX);
    const canvasHeight = this.rows * this.apothem * 2 - (this.apothem - 2 * this.startingY);
    this.canvas.width = this.config.fitToGrid ? canvasWidth : 100;
    this.canvas.height = this.config.fitToGrid ? canvasHeight : 100;
    this.canvas.offset = 0;
  }

  initialize() {
    this.#normalizeCanvas();
    console.log(`HexGrid attached to ${this.canvas.getAttribute('id')}`);
    console.log(`rows:${this.rows}, columns:${this.columns}, radius:${this.circumradius}`);
  }

  createGrid(fillColor = "white", lineColor = "black", image = null) {
    const tiles = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const tile = { x: j, y: i, fill: fillColor, line: lineColor, image: image };
        tiles.push(tile);
      }
    }
    return tiles;
  }

  // draws one single hex around the center
  #drawHex(x = 0, y = 0, fill = "transparent", line = "black") {
    const centerYEven = y * this.apothem * 2 + this.startingY;
    const centerYOdd = centerYEven + this.apothem;
    const centerY = x % 2 === 0 ? centerYEven : centerYOdd;
    const centerX = this.edge * x + this.startingX;
    const fillColor = fill;
    const lineColor = line;

    this.ctx.beginPath();
    this.ctx.moveTo(centerX + this.circumradius, centerY);

    for (let i = 0; i < 6; i++) {
      let xx = centerX + this.circumradius * Math.cos(this.angle * i);
      let yy = centerY + this.circumradius * Math.sin(this.angle * i);
      this.ctx.lineTo(xx, yy);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = `${lineColor}`;
    this.ctx.stroke();
    this.ctx.fillStyle = `${fillColor}`;
    this.ctx.fill();
  }

  getClickedTile(e) {
    // Get canvas coordinates
    const canvasOffset = $(this.canvas).offset();
    const offsetX = canvasOffset.left;
    const offsetY = canvasOffset.top;

    // Get click coordinates accounting for scrolling
    const clickedX = Math.round(e.pageX - offsetX);
    const clickedY = Math.round(e.pageY - offsetY);

    // Calculate scale factor to normalize coordinates
    const scaleFactorX = this.canvas.width / this.canvas.offsetWidth;
    const scaleFactorY = this.canvas.height / this.canvas.offsetHeight;

    // Normalizing the x and y coordinates to the canvas scale
    const normalizedX = Math.round(clickedX * scaleFactorX);
    const normalizedY = Math.round(clickedY * scaleFactorY);

    // Find potential centers for hexagons surrounding the click
    const possibleCenters = this.#findPossibleCenters(normalizedX, normalizedY);

    // Filter to keep only those within the immediate neighbor range
    const cellsWithinRange = possibleCenters.filter((obj) => obj.euclidean < this.circumradius);

    // Select the target cell with the smallest distance
    const targetCell = cellsWithinRange.reduce((min, current) => (current.euclidean < min.euclidean ? current : min), {
      x: -1,
      y: -1,
      euclidean: Infinity,
    });

    // Check if the target cell is valid
    if (targetCell.x >= 0 && targetCell.x < this.columns && targetCell.y >= 0 && targetCell.y < this.rows) {
      if (!this.#isInsideHex(targetCell.x, targetCell.y, normalizedX, normalizedY)) {
        return { x: -1, y: -1 }; // Return invalid cell
      }
    } else {
      return { x: -1, y: -1 }; // Out of bounds return
    }

    delete targetCell.euclidean;
    return targetCell;
  }

  #isInsideHex(centerX, centerY, clickX, clickY) {
    this.#drawHex(centerX, centerY, "transparent", "transparent");
    return this.ctx.isPointInPath(clickX, clickY);
  }

  #findPossibleCenters(x, y) {
    const mapX = Math.floor(x / (1.5 * this.circumradius));
    const mapY = Math.floor(y / (2 * this.apothem));

    const euclideanArray = [];
    const [iMin, iMax] = [Math.max(mapX - 1, 0), Math.min(mapX + 2, this.columns)];
    const [jMin, jMax] = [Math.max(mapY - 1, 0), Math.min(mapY + 2, this.rows)];

    for (let i = iMin; i < iMax; i++) {
      for (let j = jMin; j < jMax; j++) {
        const epicenter = {
          x: i,
          y: j,
        };

        const centerYEven = j * this.apothem * 2 + this.startingY;
        const centerYOdd = centerYEven + this.apothem;
        const coordY = i % 2 === 0 ? centerYEven : centerYOdd;
        const coordX = this.edge * i + this.startingX;

        // Calculate Euclidean distance
        const sum = Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2);
        epicenter.euclidean = Math.sqrt(sum);
        euclideanArray.push(epicenter);
      }
    }
    return euclideanArray;
  }

  drawImages(hexes = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const hexImagePromises = [];

    hexes.forEach((hex) => {
      const filename = hex.image;

      // Check if the filename is null
      if (filename === null || filename === undefined) {
        // If filename is null, just draw the hexagon with fill color and line
        this.#drawImg(hex.x, hex.y, null, hex.fill, hex.line);
        return; // Skip to the next hex
      }

      // Check if the image is already cached
      if (!this.imageCache[filename]) {
        // If not cached, prepare to load it

        const img = new Image();
        img.src = filename;

        // Cache the image when it loads
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            this.imageCache[filename] = img;
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${filename}`);
            reject(new Error(`Failed to load image: ${filename}`));
          };
        });

        hexImagePromises.push(loadPromise);
      } else {
        // Already cached, so no need to load again
        hexImagePromises.push(Promise.resolve());
      }
    });

    // Wait for all images to load
    Promise.all(hexImagePromises)
      .then(() => {
        hexes.forEach((hex) => {
          const filename = hex.image;
          const img = this.imageCache[filename];
          this.#drawImg(hex.x, hex.y, img, hex.fill, hex.line);
        });
      })
      .catch((error) => {
        console.error("Error loading images: ", error);
      });
  }

  // Draws one single hex and the image within it
  #drawImg(x = 0, y = 0, image, fillColor, line = "black") {
    const centerYEven = y * this.apothem * 2 + this.startingY;
    const centerYOdd = centerYEven + this.apothem;
    const centerY = x % 2 === 0 ? centerYEven : centerYOdd;
    const centerX = this.edge * x + this.startingX;

    this.ctx.beginPath();
    this.ctx.moveTo(centerX + this.circumradius, centerY);

    for (let i = 0; i < 6; i++) {
      let xx = centerX + this.circumradius * Math.cos(this.angle * i);
      let yy = centerY + this.circumradius * Math.sin(this.angle * i);
      this.ctx.lineTo(xx, yy);
    }
    this.ctx.closePath();
    this.ctx.save(); // Save the current context state
    this.ctx.clip(); // Clip the canvas to the hexagon before drawing image
    this.ctx.fillStyle = `${fillColor}`;
    this.ctx.fill();

    // Draw the image inside the hexagon
    if (image) {
      this.ctx.drawImage(
        image,
        centerX - this.circumradius * 0.75,
        centerY - this.apothem * 0.5,
        this.circumradius * 1.5,
        this.apothem * 1.5
      );
    }

    this.ctx.restore(); // Reset the context to the saved state
    this.ctx.strokeStyle = line; // Default line color, can be parameterized if needed

    if (this.hasCoordinates) {
      this.ctx.textBaseline = "bottom";
      this.ctx.textAlign = "center";
      this.ctx.fillText(`${x},${y}`, centerX, centerY - this.apothem / 2); /* TODO: take these centrally */
    }

    this.ctx.stroke();
  }
}
export default HexGrid;

/*
  drawHexes(hexes = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    hexes.map((hex) => {
      this.#drawHex(hex.x, hex.y, hex.fill, hex.line);
    });
  }
*/
