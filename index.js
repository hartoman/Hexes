$(function () {
  const rows = 50;
  const cols = 10;
  const radius = 10;

  normalizeCanvas(rows, cols, radius);
  drawHexGrid(rows, cols, radius);
  bindListeners();
});

// draws a grid of hexes of the given number of rows and columns, with given hex radius
function drawHexGrid(rows, cols, radius) {
  const ctx = $("#canvas")[0].getContext("2d");
  const angle = Math.PI / 3;
  const side = Math.sqrt(3) * radius * Math.cos(Math.PI / 6);
  const offsetY = radius * (Math.sqrt(3) / 2);

  for (let i = 0; i < rows; i++) {
    const centerYEven = (i +1)* offsetY * 2;
    drawHexLine(cols, centerYEven);
  }

  /**
   * Draws a line of hexes, where the odd numbers are on the lower side
   * @param {*} cols: number of columns, is array length
   * @param {*} centerYEven: the height of the center of the even hexes
   */
  function drawHexLine(cols, centerYEven) {
    const centerYOdd = centerYEven + offsetY;

    for (let j = 0; j < cols; j++) {
      const centerX = side + j * side - side*0.3;
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
    ctx.fillText(`1`,centerX,centerY)
  }
}

function normalizeCanvas(rows, cols, radius) {
  const canvas = $("#canvas")[0];
  const angle = Math.PI / 3;
  const side = Math.sqrt(3) * radius * Math.cos(Math.PI / 6);
  const offsetY = radius * (Math.sqrt(3) / 2);

  canvas.width =window.innerWidth;// (cols-1)*side; // window.innerWidth;
  canvas.height = window.innerHeight;//rows * offsetY * 2; // window.innerHeight;
  canvas.offset=0;
}

function bindListeners() {
  // Get canvas element and context
  var canvas = $("#canvas")[0];

  // Handle click event on canvas
  $("#canvas").click(function (e) {
    var ctx = $("#canvas")[0].getContext("2d");

    // Get canvas coordinates
    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    // Calculate scale factor to normalize coordinates
    var scaleFactor = canvas.width / canvas.offsetWidth;

    // Get click coordinates
    var x = Math.round((e.clientX - offsetX) * scaleFactor);
    var y = Math.round((e.clientY - offsetY) * scaleFactor);

    // Log normalized coordinates
    console.log("Normalized coordinates: (" + x + ", " + y + ")");
  });
}
