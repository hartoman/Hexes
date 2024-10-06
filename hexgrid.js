class HexGrid {
  constructor(
    el,
    { rows = 0, columns = 0, radius = 0, fitToGrid = false, startCenterX = false, startCenterY = false }
  ) {
    this.canvas = $(el)[0];
    this.ctx = $(el)[0].getContext("2d");
    this.rows = rows;
    this.columns = columns;
    this.circumradius = radius;
    this.apothem = this.circumradius * (Math.sqrt(3) / 2); // the height difference of odd-numbered cells
    this.edge = Math.sqrt(3) * this.circumradius * Math.cos(Math.PI / 6);
    this.angle = Math.PI / 3;
    this.startingX = startCenterX ? 0 : this.circumradius; // grid starts from centerX of first hex. zero value means start from top
    this.startingY = startCenterY ? 0 : this.apothem; // grid starts from left corner of first hex. zero value means start from centerY

    this.#normalizeCanvas(fitToGrid);
    this.imageCache = {};

    console.log(`HexGrid attached to ${$(el).attr("id")}`);
    console.log(`rows:${this.rows}, columns:${this.columns}, radius:${this.circumradius}`);
  }

  #normalizeCanvas(fitToGrid) {
    const canvasWidth = this.columns * this.edge -(this.edge-2* this.startingX)
    const canvasHeight = this.rows * this.apothem * 2 - (this.apothem-2*this.startingY);
    this.canvas.width = fitToGrid ? canvasWidth : 100
    this.canvas.height = fitToGrid ? canvasHeight : 100;
    this.canvas.offset = 0;
  }

  createGrid(fillColor = "white", lineColor = "black", type = null) {
    const tiles = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const tile = { x: j, y: i, fill: fillColor, line: lineColor, type:type};
        tiles.push(tile);
      }
    }
    return tiles;
  }

  drawHexes(hexes = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    hexes.map((hex) => {
      this.#drawHex(hex.x, hex.y, hex.fill, hex.line);
    });
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

    // Get current scroll position
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Calculate scale factor to normalize coordinates
    const scaleFactorX = this.canvas.width / this.canvas.offsetWidth;
    const scaleFactorY = this.canvas.height / this.canvas.offsetHeight;

    // Get click coordinates adjusted for scrolling
    const clickedX = Math.round((e.clientX - offsetX + scrollX) * scaleFactorX);
    const clickedY = Math.round((e.clientY - offsetY + scrollY) * scaleFactorY);

    // because of hex shape we can only have an approximation of the cell, so we also get the neighboring cells
    const possibleCenters = this.#findPossibleCenters(clickedX, clickedY);

    // we only keep the immediate neighbors (exactly double the circumradius)
    const cellsWithinRange = possibleCenters.filter((obj) => obj.euclidean < this.circumradius);

    // target cell has the least euclidean distance
    const targetCell = cellsWithinRange.reduce((min, current) => (min.euclidean < current.euclidean ? min : current), {
        x: -1,
        y: -1,
    });

    // only one cell left, handle edge cases
    if (
        targetCell.x === 0 ||
        targetCell.x === this.columns - 1 ||
        targetCell.y === 0 ||
        targetCell.y === this.rows - 1
    ) {
        if (!this.#isInsideHex(targetCell.x, targetCell.y, clickedX, clickedY)) {
            targetCell.x = -1;
            targetCell.y = -1;
        }
    }
    delete targetCell.euclidean;
    return targetCell;
}

  #isInsideHex(centerX, centerY, clickX, clickY) {
    this.#drawHex(centerX, centerY, "transparent", "transparent");
    // Check if the point is within the hexagon
    if (this.ctx.isPointInPath(clickX, clickY)) {
      //  console.log("Clicked point is within the hexagon.");
      return true;
    } else {
      // console.log("Clicked point is outside the hexagon.");
      return false;
    }
  }

  // gets all possible centers from neighboring cells
  #findPossibleCenters(x, y) {
    const mapX = Math.floor(x / (1.5 * this.circumradius)); // it is no exactly divided by 2 because of the even-odd
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

        //calculate individual center coordinates
        const centerYEven = j * this.apothem * 2 + this.startingY;
        const centerYOdd = centerYEven + this.apothem;
        const coordY = i % 2 === 0 ? centerYEven : centerYOdd;
        const coordX = this.edge * i + this.startingX;

        // gets eucleidian distance
        const sum = Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2);
        epicenter.euclidean = Math.sqrt(sum);
        euclideanArray.push(epicenter);
      }
    }
    //  console.log(euclideanArray)
    return euclideanArray;
  }

  drawImages(hexes = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const hexImagePromises = [];

    hexes.forEach((hex) => {
        const type = hex.type;
       const filename = `${type}.png`

               // Check if the type is null
               if (type === null) {
                // If type is null, just draw the hexagon with fill color and line
                this.#drawImg(hex.x, hex.y, null, hex.fill, hex.line);
                return; // Skip to the next hex
            }

        // Check if the image is already cached
        if (!this.imageCache[type]) {
            // If not cached, prepare to load it

            const img = new Image();
            img.src = filename;

            // Cache the image when it loads
            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => {
                    this.imageCache[type] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${type}`);
                    reject(new Error(`Failed to load image: ${type}`));
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
          console.log(this.imageCache)
            hexes.forEach((hex) => {
                const type = hex.type;
                const img = this.imageCache[type];
                this.#drawImg(hex.x, hex.y, img, hex.fill ,hex.line);
            });
        })
        .catch((error) => {
            console.error("Error loading images: ", error);
        });
}

// Draws one single hex and the image within it
#drawImg(x = 0, y = 0, image, fillColor, line="black") {
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
      this.ctx.drawImage(image, 
          centerX - this.circumradius, 
          centerY - this.apothem, 
          this.circumradius * 2, 
          this.apothem * 2
      );
  }

  this.ctx.restore(); // Reset the context to the saved state
  this.ctx.strokeStyle = line; // Default line color, can be parameterized if needed
  this.ctx.stroke();
}
}
export default HexGrid;
