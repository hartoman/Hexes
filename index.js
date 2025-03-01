import HexGrid from "./hexgrid.js";
import { MapGenerator } from "./mapgen.js";

$(function () {
  const MAP_ROWS = 20;
  const MAP_COLUMNS = 20;
  const RADIUS = 30;
  let backgroundCanvas;
  let foregroundCanvas;
  // preloadImages(["a.jpg"]);

  initCanvas();
  bindListeners();
  useCanvas();

  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", {
      rows: MAP_ROWS,
      columns: MAP_COLUMNS,
      radius: RADIUS,
      fitToGrid: true,
      startCenterX: false,
      startCenterY: false,
    });
    //   foregroundCanvas = new HexGrid("#canvas2", { rows: MAP_ROWS, columns: MAP_COLUMNS, radius: RADIUS, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $("#canvas2").on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e);
      console.log(clicked);
      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
    // get basic layout from the hexgrid
    // const tiles = backgroundCanvas.createGrid("white", "black");

    const mapConfig = {
      maxPeaks: 30,
      maximumElevation: 6,
      rows: MAP_ROWS,
      cols: MAP_COLUMNS,
      isIslandMap: false,
    };

    const mapGenerator = new MapGenerator(mapConfig);
    mapGenerator.createMap();

    // get randomized color map
    const tiles = mapGenerator.getTileset();

    // images
    backgroundCanvas.drawImages(tiles);

    //colors
    //    backgroundCanvas.drawHexes(tiles);

    // paint a specific tile
    //  foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});
