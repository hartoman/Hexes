import HexGrid from "./Hexgrid.js";
import { MapGenerator } from "./MapGenerator.js";

$(function () {
  const MAP_ROWS = 20;
  const MAP_COLUMNS = 20;
  const RADIUS = 30;
  let backgroundCanvas;
  let foregroundCanvas;
  // preloadImages(["a.jpg"]);

  const mapConfig = {
    maxPeaks:30,
    maximumElevation: 6,
    rows: MAP_ROWS,
    cols: MAP_COLUMNS,
    isIslandMap: false,
  };

  const COLOR_SCHEME=[     
    [0, ["DeepSkyBlue", "lightblue"]],    //
    [1, ["GreenYellow", "GreenYellow"]],    //
    [2, ["limegreen", "limegreen"]],    //
    [3, ["ForestGreen", "ForestGreen"]],    //
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
    // get basic layout from the hexgrid
    // const tiles = backgroundCanvas.createGrid("white", "black");



    const mapGenerator = new MapGenerator(mapConfig);
    mapGenerator.setupColorScheme(COLOR_SCHEME);
    mapGenerator.setupIconScheme(ICON_SCHEME);
    mapGenerator.createMap()

    // get randomized color map
    const tiles = mapGenerator.getTiles();

    // images
    backgroundCanvas.drawImages(tiles);

    //colors
    //    backgroundCanvas.drawHexes(tiles);

    // paint a specific tile
    //  foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});
