import HexGrid from "./hexgrid.js";
import { createMap } from "./mapgen.js";

$(function () {

  const MAP_ROWS = 20
  const MAP_COLUMNS = 20;
  const RADIUS = 20;
  let backgroundCanvas;
  let foregroundCanvas;
 // preloadImages(["a.jpg"]);

  initCanvas();
  bindListeners();
  useCanvas();
 

  
  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", { rows: MAP_ROWS, columns: MAP_COLUMNS, radius: RADIUS, fitToGrid: true, startCenterX: false, startCenterY: false });
    foregroundCanvas = new HexGrid("#canvas2", { rows: MAP_ROWS, columns: MAP_COLUMNS, radius: RADIUS, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas2').on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e)
      console.log(clicked)
      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
   

    // get basic layout from the hexgrid
  //   const tiles = backgroundCanvas.createGrid("green", "lightgreen","tree");

    // get randomized color map
    const tiles = createMap(3,7,MAP_ROWS,MAP_COLUMNS); 


     // images
     backgroundCanvas.drawImages(tiles)

    //colors
   // backgroundCanvas.drawHexes(tiles);

    // paint a specific tile
  //  foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);

  }
});


/*
function preloadImages(array) {
  if (!preloadImages.list) {
      preloadImages.list = [];
  }
  var list = preloadImages.list;
  for (var i = 0; i < array.length; i++) {
      var img = new Image();
      img.onload = function() {
          var index = list.indexOf(this);
          if (index !== -1) {
              // remove image from the array once it's loaded
              // for memory consumption reasons
              list.splice(index, 1);
          }
      }
      list.push(img);
      img.src = array[i];
  }
}
*/
