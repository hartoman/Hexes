$(function () {
  const rows = 20;
  const cols = 20;
  const radius = 10;
  
  normalizeCanvas();
  drawHexGrid(rows, cols, radius);
});

// draws a grid of hexes of the given number of rows and columns, with given hex radius 
function drawHexGrid(rows, cols, radius) {
  const ctx = $("#canvas")[0].getContext("2d");
  const angle = Math.PI / 3;
  const side = Math.sqrt(3) * radius * Math.cos(Math.PI / 6);
  const offsetY = radius * (Math.sqrt(3) / 2);

  for (let i=-1;i<rows;i++){
    const centerYEven = i*offsetY*2;
    drawHexLine(cols,centerYEven);
  }

  /**
   * Draws a line of hexes, where the odd numbers are on the lower side
   * @param {*} cols: number of columns, is array length 
   * @param {*} centerYEven: the height of the center of the even hexes 
   */
  function drawHexLine(cols,centerYEven) {
    const centerYOdd = centerYEven + offsetY;

    for (let i = -1; i < cols; i++) {
      const centerX = side + i * side;
      if (i % 2 === 0) {
        // zero or even
        drawHex(centerX, centerYEven);
      } else {
        // odd
        drawHex(centerX, centerYOdd);
      }
    }
  }

  // draws one single hex around the center
  function drawHex(centerX, centerY) {
    ctx.beginPath();
    ctx.moveTo(centerX + radius, centerY);

    for (let i = 0; i < 6; i++) {
      let xx = centerX + radius * Math.cos(angle * i);
      let yy = centerY + radius * Math.sin(angle * i);
      ctx.lineTo(xx, yy);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function normalizeCanvas() {
  const canvas = $("#canvas")[0];
  canvas.width = 500;// window.innerWidth;
  canvas.height = 500;// window.innerHeight;
}
