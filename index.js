import HexGrid from "./Hexgrid.js";
import  MapGenerator  from "./MapGenerator.js";
import  TileSetCreator  from "./TileSetCreator.js";

$(function () {
  const MAP_ROWS = 13;
  const MAP_COLUMNS = 30;
  const RADIUS = 30;
  let backgroundCanvas;
  let foregroundCanvas;
  // preloadImages(["a.jpg"]);

  const mapConfig = {
    maxPeaks:10,
    maximumElevation: 6,
    rows: MAP_ROWS,
    cols: MAP_COLUMNS,
    isIslandMap: false,
  };

  const COLOR_SCHEME = [     
    [-1, ["DeepSkyBlue","DeepSkyBlue"]],
    [0, ["SkyBlue", "SkyBlue"]],    //
    [1, ["GreenYellow", "GreenYellow"]],    //
    [2, ["limegreen", "limegreen"]],    //
    [3, ["#91C513", "#91C513"]],    //
    [4, ["yellow", "yellow"]],    //
    [5, ["GoldenRod", "GoldenRod"]],    //
    [6, ["chocolate", "chocolate"]]//    
  ];

  const ICON_SCHEME = [
    ['mountain','../assets/svgs/mountain.svg'],
    ['hill', '../assets/svgs/hill.svg'],
    ['forest', '../assets/svgs/forest.svg'],
    ['swamp', '../assets/svgs/swamp.svg'],
  ]

  const CANVAS_CONFIG = {
    rows: MAP_ROWS,
    columns: MAP_COLUMNS,
    radius: RADIUS,
    fitToGrid: true,
    startCenterX: false,
    startCenterY: false,
  }

  initCanvas();
  bindListeners();
  useCanvas();

  function initCanvas() {
    backgroundCanvas = new HexGrid("canvas1",CANVAS_CONFIG);
    //   foregroundCanvas = new HexGrid("canvas2", CANVAS_CONFIG);
  }

  function bindListeners() {
    $("#canvas2").on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e);
      console.log(clicked);
      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
    const mapGenerator = new MapGenerator(mapConfig);
    mapGenerator.createMap()

    // get randomized color map
    const tiles = mapGenerator.getTiles();
    console.log(tiles)

    const tileSetCreator = new TileSetCreator(COLOR_SCHEME, ICON_SCHEME) 
    const newTileSet = tileSetCreator.createTilesetFromTiles(tiles)

    // images
    backgroundCanvas.drawImages(newTileSet);

    // paint a specific tile
    //  foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});
