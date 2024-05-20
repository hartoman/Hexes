class HexGrid {
  constructor(el, { rows = 0, columns = 0, radius = 0, adaptTogrid = false,startCenterX=false, startCenterY=false}) {
    this.rows = rows;
    this.columns = columns;
    this.radius = radius;
    this.canvas = $(el)[0];
    this.ctx = $(el)[0].getContext("2d");
    this.angle = Math.PI / 3;
    this.side = Math.sqrt(3) * this.radius * Math.cos(Math.PI / 6);
    this.offsetY = (0.5 + this.radius) * (Math.sqrt(3) / 2); // the height difference of odd-numbered cells
    this.startingX =startCenterX? -0.5:0; // grid starts from centerX of first hex. zero value means start from top
    this.startingY = startCenterY ? 0 : this.offsetY; // grid starts from left corner of first hex. zero value means start from centerY
    // TODO FIX STARTINGY RENDER AND GET TILE
    // TODO CHECK CANVAS SIZE FOR DIFFERENT STARTING X-Y

    this.normalizeCanvas(adaptTogrid);

    console.log(`HexGrid attached to ${$(el).attr("id")}`);
    console.log(`rows:${this.rows}, columns:${this.columns}, radius:${this.radius}`);
  }

  normalizeCanvas(adaptTogrid) {
    this.canvas.width = adaptTogrid ? (this.columns - 1) * this.side : window.innerWidth;
    this.canvas.height = adaptTogrid ? (this.rows - 0.5) * this.offsetY * 2 : window.innerHeight;
    this.canvas.offset = 0;
  }

  createGrid(fillColor = "transparent", lineColor = "black") {
    const tiles = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const tile = { x: j, y: i, fill: fillColor, line: lineColor };
        tiles.push(tile);
      }
    }
    return tiles;
  }

  drawHexes(hexes = []) {
    hexes.map((hex) => {
      this.drawHex(hex.x, hex.y, hex.fill, hex.line);
    });
  }

  // draws one single hex around the center
  drawHex(x = 0, y = 0, fill = "transparent", line = "black") {
    const centerYEven = y * this.offsetY * 2;
    const centerYOdd = centerYEven + this.offsetY;
    const centerY = x % 2 === 0 ? centerYEven : centerYOdd;
    const centerX = this.side * (0.7 + x + this.startingX);
    const fillColor = fill;
    const lineColor = line;

    this.ctx.beginPath();
    this.ctx.moveTo(centerX + this.radius, centerY);

    for (let i = 0; i < 6; i++) {
      let xx = centerX + this.radius * Math.cos(this.angle * i);
      let yy = centerY + this.radius * Math.sin(this.angle * i);
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

    // Calculate scale factor to normalize coordinates
    const scaleFactor = this.canvas.width / this.canvas.offsetWidth;

    // Get click coordinates
    const clickedX = Math.round((e.clientX - offsetX) * scaleFactor);
    const clickedY = Math.round((e.clientY - offsetY) * scaleFactor);

    // because of hex shape we can only have an approximation of the cell, so we also get the neighboring cells
    const possibleCenters = this.findPossibleCenters(clickedX, clickedY);

    // we only keep the cells withing the borders of the grid
    const cellsWithinRange = possibleCenters.filter((obj) => obj.euclidean < this.radius);

    // target cell has the least euclidean distance
    const targetCell = cellsWithinRange.reduce((min, current) => (min.euclidean < current.euclidean ? min : current), {
      x: -1,
      y: -1,
    });
    delete targetCell.euclidean;
    // console.log(targetCell.x,targetCell.y);
    return targetCell;
  }

  findPossibleCenters(x, y) {
    const mapX = Math.round((x - this.side * (0.7 + this.startingX)) / this.side);
    const mapY = Math.floor(y / (2 * this.offsetY));

    //   console.log(mapX, mapY);
    const euclideanArray = [];
    const [iMin, iMax] = [Math.max(mapX - 1, 0), Math.min(mapX + 2, this.columns)];
    const [jMin, jMax] = [Math.max(mapY - 1, 0), Math.min(mapY + 2, this.rows)];

    for (let i = iMin; i < iMax; i++) {
      for (let j = jMin; j < jMax; j++) {
        const epicenter = {
          x: i,
          y: j,
        };
        const coordX = this.side * (0.7 + i + this.startingX);
        const coordY = i % 2 === 0 ? Math.floor(j * this.offsetY * 2) : Math.floor(j * this.offsetY * 2 + this.offsetY);

        const sum = Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2);
        epicenter.euclidean = Math.sqrt(sum);
        euclideanArray.push(epicenter);
      }
    }
    return euclideanArray;
  }
}

export default HexGrid;
