import HexGrid from "./hexgrid.js";

$(function () {

  let backgroundCanvas;
  let foregroundCanvas;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", { rows: 15, columns: 50, radius: 10, fitToGrid: true, startCenterX: false, startCenterY: false });
    foregroundCanvas = new HexGrid("#canvas2", { rows: 15, columns: 50, radius: 10, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas2').on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e)
      console.log(clicked)
      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
    const tiles = backgroundCanvas.createGrid("white", "black");
    backgroundCanvas.drawHexes(tiles);
    foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});







