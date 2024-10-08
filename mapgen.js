export const createMap = (maxPeaks=1, maximumElevation=7, rows, cols) => {
    const tiles = createBasicTiles(rows, cols);


        // define place for each of the peaks
        for (let i = 0; i < maxPeaks; i++) {

        //    const randomX = randomBetween(0, cols - 1); // Ensure it does not exceed cols-1
        //    const randomY = randomBetween(0, rows - 1); // Ensure it does not exceed rows-1
       
            const randomX = randomBetween(maximumElevation, cols - 1-maximumElevation); // Ensure it does not exceed cols-1 and that the marginal tiles will be sea
            const randomY = randomBetween(maximumElevation, rows - 1-maximumElevation); // Ensure it does not exceed rows-1

            // guarrantees that 1st peak will be at max elevation, while the rest will be more random
            if (i == 0) {
                setElevation(maximumElevation, randomX, randomY);
            } else {
                setElevation(randomBetween(2, maximumElevation), randomX, randomY);
            }
        }



    adaptElevationToColors(tiles)
  //  console.log(tiles);
    return tiles;

    function setElevation(maxElevation, x, y) {

if(maxElevation<=0){
    return;
}

        // Ensure that x and y are within bounds
        if (x < 0 || x >= cols || y < 0 || y >= rows) {
            return;
        }

        const tile = tiles.find(tile => tile.x === x && tile.y === y);

        // If the tile does not exist, exit the function
        if (!tile) {
            return;
        }
    
        if (maxElevation > tile.elevation) {
            tile.elevation = maxElevation;
        }
    
        if (maxElevation > 0) {
            // Get a random axis of expansion (horizontal/vertical or diagonal)
            let axis = getRandomBoolean();
            // expands on the horizontal-vertical axis
            if (axis) {
                setElevation(maxElevation - randomBetween(1, 2), x + 1, y);
                setElevation(maxElevation - randomBetween(1, 2), x - 1, y);
                setElevation(maxElevation - randomBetween(1, 2), x, y + 1);
                setElevation(maxElevation - randomBetween(1, 2), x, y - 1);
            } else {
                // expands on diagonal
                setElevation(maxElevation - randomBetween(1, 2), x + 1, y + 1);
                setElevation(maxElevation - randomBetween(1, 2), x - 1, y - 1);
                setElevation(maxElevation - randomBetween(1, 2), x - 1, y + 1);
                setElevation(maxElevation - randomBetween(1, 2), x + 1, y - 1);
            }
        }
    }
}




function createBasicTiles(rows,cols){
    const tiles = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const tile = { x: j, y: i, elevation:0, fillColor:"", type:null};
        tiles.push(tile);
      }
    }
    return tiles;
}



function randomBetween(min, max) {
    // Ensure the min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
    // Generate a random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomBoolean() {
    return Math.random() < 0.5; // Returns true if random number is less than 0.5, otherwise false
}

function adaptElevationToColors(tiles){

    
    const pathStone1 = '../assets/images/stone1.png';
    const pathStone2 = '../assets/images/stone2.png';
    const pathTree = '../assets/images/tree.png';
    const pathTree1 = '../assets/images/tree1.png';
    const pathTree2 = '../assets/images/tree2.png';
    const pathSea = '../assets/images/sea.jpg';
    const pathCastle = '../assets/images/castle.png';

    const colorMapping =new Map()
    colorMapping.set(0,["blue","lightblue",pathSea])
    colorMapping.set(1,["wheat","wheat",null])
    colorMapping.set(2,["limegreen","limegreen",pathTree2])
    colorMapping.set(3,["green","green",null])
    colorMapping.set(4,["darkgreen","darkgreen",pathTree1])
    colorMapping.set(5,["darkgray","darkgray",pathTree])
    colorMapping.set(6,["lightgray","lightgray",pathStone2])
    colorMapping.set(7,["white","white",pathCastle])

    tiles.forEach(tile => {
        const tileVariables = colorMapping.get(tile.elevation);
        tile.fill =tileVariables[0];
        tile.line=tileVariables[1];
        tile.image=tileVariables[2];
    });
}





// createMap(7,10,10) 