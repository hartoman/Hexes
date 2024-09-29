import HexGrid from "./hexgrid.js";


$(function () {

  let backgroundCanvas;
  let foregroundCanvas;
 // preloadImages(["a.jpg"]);

  initCanvas();
  bindListeners();
  useCanvas();
 

  
  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", { rows: 15, columns: 10, radius: 30, fitToGrid: true, startCenterX: false, startCenterY: false });
    foregroundCanvas = new HexGrid("#canvas2", { rows: 15, columns: 10, radius: 30, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas2').on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e)
      console.log(clicked)
      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
    const tiles = backgroundCanvas.createGrid("white", "transparent");
    backgroundCanvas.drawImages(tiles)
  //  backgroundCanvas.drawHexes(tiles);
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
