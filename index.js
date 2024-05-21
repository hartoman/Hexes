import HexGrid from "./hexgrid.js";

$(function () {

  let hex1;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    hex1 = new HexGrid("#canvas1", { rows: 4, columns: 4, radius: 100, fitToGrid: false ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas1').on("click", (e) => {
      const clicked = hex1.getClickedTile(e)
      console.log(clicked)
    });
  }

  function useCanvas() {
    const tiles = hex1.createGrid("white", "black");
    hex1.drawHexes(tiles);
    hex1.drawHexes([{ x: 0, y: 8, fill: "red", line: "blue" }]);
  }
});







