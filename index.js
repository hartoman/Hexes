import HexGrid from "./hexgrid.js";

$(function () {

  let hex1;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    hex1 = new HexGrid("#canvas1", { rows: 11, columns: 11, radius: 20, adaptTogrid: false ,startCenterX:true,startCenterY:true});
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







