import HexGrid from './hexgrid.js'

$(function () {
    initCanvas()
    bindListeners();
  });

  function bindListeners(){

  }

function initCanvas() {
  const hex = new HexGrid('#canvas', { rows: 10, columns: 10, radius: 20,adaptTogrid:true })
  const tiles = hex.createGrid('transparent','black')
  hex.drawHexes(tiles)
  hex.drawHexes([{x:5,y:5,fill:"red",line:'blue'}])
  }