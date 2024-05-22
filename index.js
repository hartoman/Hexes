import HexGrid from "./hexgrid.js";

$(function () {

  let backgroundCanvas;
  let foregroundCanvas;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", { rows: 4, columns: 4, radius: 20, fitToGrid: true, startCenterX: false, startCenterY: false });
    foregroundCanvas = new HexGrid("#canvas2", { rows: 4, columns: 4, radius: 20, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas2').on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e)
      console.log(clicked)
    });
  }

  function useCanvas() {
    const tiles = backgroundCanvas.createGrid("white", "black");
    backgroundCanvas.drawHexes(tiles);
    foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});







