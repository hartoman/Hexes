class HexGrid {
  constructor(el, { rows = 0, columns = 0, radius = 0,adaptTogrid=false }) {
    this.rows = rows;
    this.columns = columns;
    this.radius = radius;
    this.canvas=$(el)[0]
    this.ctx = $(el)[0].getContext("2d");
    this.angle = Math.PI / 3;
    this.side = Math.sqrt(3) * this.radius * Math.cos(Math.PI / 6);
    this.offsetY = (0.5+this.radius) * (Math.sqrt(3) / 2);    // the height difference of odd-numbered cells
    this.startingX=-0.5;   // grid starts from centerX of first hex. zero value means start from top
    this.startingY = 0 // grid starts from left corner of first hex. zero value means start from centerY
    
    this.normalizeCanvas(adaptTogrid)

    console.log(`HexGrid attached to ${$(el).attr("id")}`);
    console.log(`rows:${this.rows}, columns:${this.columns}, radius:${this.radius}`)
  }



  createGrid(fillColor='transparent',lineColor='black') {

    const tiles=[]
    for (let i = 0; i < this.rows; i++){
      for (let j = 0; j < this.columns; j++){
        const tile = { x: j, y: i,fill:fillColor,line:lineColor}
        tiles.push(tile)
      }
    }
    return tiles;
  }

  drawHexes(hexes = []) {
    hexes.map((hex) => {
      this.drawHex(hex.x, hex.y,hex.fill,hex.line)
    })
  }

    // draws one single hex around the center
    drawHex(x=0, y=0, fill='transparent',line='black') {

      const centerYEven = y * this.offsetY * 2;
      const centerYOdd = centerYEven + this.offsetY;
      const centerY = (x % 2 === 0) ? centerYEven : centerYOdd;
      const centerX = this.side * (0.7 + x + this.startingX); 
      const fillColor = fill;
      const lineColor = line;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX + this.radius, centerY);
  
      for (let i = 0; i < 6; i++) {
        let xx = centerX + this.radius * Math.cos(this.angle * i);
        let yy = centerY + this.radius * Math.sin(this.angle * i);
        this.ctx.lineTo(xx, yy);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle=`${lineColor}`;
      this.ctx.stroke();
  
      this.ctx.fillStyle=`${fillColor}`;
      this.ctx.fill()
    }
  
  normalizeCanvas(adaptTogrid) {
    this.canvas.width = (adaptTogrid) ? (this.columns-1) * this.side : window.innerWidth;
    this.canvas.height = (adaptTogrid) ? (this.rows-1) * this.offsetY * 2: window.innerHeight;
    this.canvas.offset = 0;
  }
}

export default HexGrid;
