const rows = 10;
const cols = 10;
const radius = 20;

const canvas = $("#canvas")[0];
const ctx = $("#canvas")[0].getContext("2d");

const angle = Math.PI / 3;
const side = Math.sqrt(3) * radius * Math.cos(Math.PI / 6);
const offsetY = (0.5+radius) * (Math.sqrt(3) / 2);    // the height difference of odd-numbered cells

const startingX=-0.5;   // grid starts from centerX of first hex. zero value means start from top
const startingY = 0 // grid starts from left corner of first hex. zero value means start from centerY

$(function () {
  normalizeCanvas();
  drawHexGrid();
  bindListeners();
});

// draws a grid of hexes of the given number of rows and columns, with given hex radius
function drawHexGrid() {
  for (let i = 0; i < rows; i++) {
    const centerYEven = i * offsetY * 2;
    const centerYOdd = centerYEven + offsetY;

    for (let j = 0; j < cols; j++) {
      const centerX = side * (0.7 + j +startingX); 
      if (j % 2 === 0) {
        // zero or even
        drawHex(centerX, centerYEven);
      } else {
        // odd
        drawHex(centerX, centerYOdd);
      }
    }
  }

  // draws one single hex around the center
  function drawHex(x, y) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);

    for (let i = 0; i < 6; i++) {
      let xx = x + radius * Math.cos(angle * i);
      let yy = y + radius * Math.sin(angle * i);
      ctx.lineTo(xx, yy);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle="red";
    ctx.fill()
   // ctx.fillText(`1`, x, y);
  }
}

function normalizeCanvas() {
  canvas.width = window.innerWidth; // (cols-1)*side; // window.innerWidth;
  canvas.height = window.innerHeight; //rows * offsetY * 2; // window.innerHeight;
  canvas.offset = 0;
}

function bindListeners() {
  // Handle click event on canvas
  $(canvas).click(function (e) {
   const tile= getClickedTile(e);
   console.log(tile);
  });
}

function getClickedTile(e) {
  // Get canvas coordinates
  const canvasOffset = $(canvas).offset();
  const offsetX = canvasOffset.left;
  const offsetY = canvasOffset.top;

  // Calculate scale factor to normalize coordinates
  const scaleFactor = canvas.width / canvas.offsetWidth;

  // Get click coordinates
  const clickedX = Math.round((e.clientX - offsetX) * scaleFactor);
  const clickedY = Math.round((e.clientY - offsetY) * scaleFactor);

  // because of hex shape we can only have an approximation of the cell, so we also get the neighboring cells
  const possibleCenters = findPossibleCenters(clickedX, clickedY);

  // we only keep the cells withing the borders of the grid
  const cellsWithinRange = possibleCenters.filter(obj=>obj.euclidean<radius)

  // target cell has the least euclidean distance
  const targetCell = cellsWithinRange.reduce((min, current) =>
    min.euclidean < current.euclidean ? min : current,{x:-1,y:-1}
  );
  delete targetCell.euclidean;
 // console.log(targetCell.x,targetCell.y);
  return targetCell;
  
  function findPossibleCenters(x, y) {

    const mapX = Math.round((x - side * (0.7+startingX)) / side);
    const mapY = Math.floor(y / (2 * offsetY));
  
    //   console.log(mapX, mapY);
    const euclideanArray = [];
    const [iMin, iMax] = [Math.max(mapX - 1, 0), Math.min(mapX + 2, cols)];
    const [jMin, jMax] = [Math.max(mapY - 1, 0), Math.min(mapY + 2, rows)];
  
    for (let i = iMin; i < iMax; i++) {
      for (let j = jMin; j < jMax; j++) {
        const epicenter = {
          x: i,
          y: j,
        };
        const coordX = side * (0.7 + i +startingX);
        const coordY =
          i % 2 === 0
            ? Math.floor(j * offsetY * 2)
            : Math.floor(j * offsetY * 2 + offsetY);
  
        const sum = Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2);
        epicenter.euclidean = Math.sqrt(sum);
        euclideanArray.push(epicenter);
      }
    }
    return euclideanArray;
  }
}

function findPossibleCenters(x, y) {

  const mapX = Math.round((x - side * (0.7+startingX)) / side);
  const mapY = Math.floor(y / (2 * offsetY));

  //   console.log(mapX, mapY);
  const euclideanArray = [];
  const [iMin, iMax] = [Math.max(mapX - 1, 0), Math.min(mapX + 2, cols)];
  const [jMin, jMax] = [Math.max(mapY - 1, 0), Math.min(mapY + 2, rows)];

  for (let i = iMin; i < iMax; i++) {
    for (let j = jMin; j < jMax; j++) {
      const epicenter = {
        x: i,
        y: j,
      };
      const coordX = side * (0.7 + i +startingX);
      const coordY =
        i % 2 === 0
          ? Math.floor(j * offsetY * 2)
          : Math.floor(j * offsetY * 2 + offsetY);

      const sum = Math.pow(x - coordX, 2) + Math.pow(y - coordY, 2);
      epicenter.euclidean = Math.sqrt(sum);
      euclideanArray.push(epicenter);
    }
  }
  return euclideanArray;
}


 
