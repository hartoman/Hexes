import HexGrid from "./hexgrid.js";

$(function () {

  let hex1;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    hex1 = new HexGrid("#canvas1", { rows: 100, columns: 100, radius: 10, adaptTogrid: true ,startCenterX:true,startCenterY:true});
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
    hex1.drawHexes([{ x: 5, y: 5, fill: "red", line: "blue" }]);
  }
});







