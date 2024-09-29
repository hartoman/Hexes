import HexGrid from "./hexgrid.js";

$(function () {

  let backgroundCanvas;
  let foregroundCanvas;
  initCanvas();
  bindListeners();
  useCanvas();

  
  function initCanvas() {
    backgroundCanvas = new HexGrid("#canvas1", { rows: 15, columns: 50, radius: 30, fitToGrid: true, startCenterX: false, startCenterY: false });
    foregroundCanvas = new HexGrid("#canvas2", { rows: 15, columns: 50, radius: 30, fitToGrid: true ,startCenterX:false,startCenterY:false});
  }

  function bindListeners() {
    $('#canvas2').on("click", (e) => {
      const clicked = foregroundCanvas.getClickedTile(e)
      console.log(clicked)
/*
      const image = new Image()
      image.src="./a.jpg"*/

      foregroundCanvas.drawHexes([{ x: clicked.x, y: clicked.y, fill: "green", line: "black" }]);
    });
  }

  function useCanvas() {
    const tiles = backgroundCanvas.createGrid("white", "black");
    backgroundCanvas.drawHexes(tiles);
    foregroundCanvas.drawHexes([{ x: 0, y: 2, fill: "green", line: "black" }]);
  }
});




            // Function to handle image loading
            function imageLoaded() {
                const imageSrc = $(this).attr('src');

                // Check if the image is already in the set
                if (!loadedImages.has(imageSrc)) {
                    // Add the image src to the set
                    loadedImages.add(imageSrc);
                    console.log(`Image loaded and added to set: ${imageSrc}`);
                }
            }

            // Bind the load event to images
            $('.image').on('load', imageLoaded);

            // In case images are cached, trigger the load event manually for them
            $('.image').each(function(){
                if (this.complete) {
                    $(this).trigger('load');
                }
            });




