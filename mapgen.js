export const createMap = (maxPeaks, maximumElevation, rows, cols) => {
    const tiles = createBasicTiles(rows, cols);

 //   const randomX = randomBetween(0, cols - 1); // Ensure it does not exceed cols-1
 //   const randomY = randomBetween(0, rows - 1); // Ensure it does not exceed rows-1

 //   setElevation(maximumElevation, randomX, randomY);


        // define place for each of the peaks
        for (let i = 0; i < maxPeaks; i++) {

            const randomX = randomBetween(0, cols - 1); // Ensure it does not exceed cols-1
            const randomY = randomBetween(0, rows - 1); // Ensure it does not exceed rows-1
       

            // guarrantees that 1st peak will be at max elevation, while the rest will be more random
            if (i == 0) {
                setElevation(maximumElevation, randomX, randomY);
            } else {
                setElevation(randomBetween(maximumElevation/2, maximumElevation), randomX, randomY);
            }
        }



    adaptElevationToColors(tiles)
    console.log(tiles);
    return tiles;

    function setElevation(maxElevation, x, y) {
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
        const tile = { x: j, y: i, elevation:0, fillColor:""};
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

    const colorMapping =new Map()
    colorMapping.set(0,"blue")
    colorMapping.set(1,"wheat")
    colorMapping.set(2,"lightgreen")
    colorMapping.set(3,"green")
    colorMapping.set(4,"darkgreen")
    colorMapping.set(5,"darkgray")
    colorMapping.set(6,"lightgray")
    colorMapping.set(7,"white")

    tiles.forEach(tile => {
        const color = colorMapping.get(tile.elevation);
        tile.fill =color;
    });
}





// createMap(7,10,10) 