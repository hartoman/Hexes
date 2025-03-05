class TileSetCreator{

    constructor (colorScheme, IconScheme) {
        this.colorScheme = new Map(colorScheme);
        this.iconScheme = new Map (IconScheme);
        this.tiles = null;
        this.tileSet = null;
    }

    getTileSet = () => {
        return this.tileSet;
    }

    createTilesetFromTiles = (tiles) => {
        return tiles.map(originalTile => {
            const colors = this.colorScheme.get(originalTile.elevation) || null;
            const icons = this.iconScheme.get(originalTile.icon) || null;      
            const newTile = {
                x : originalTile.x,
                y : originalTile.y,
                fill : colors[0],
                line : colors[1] ,
                image : icons === undefined ? null : icons
            }
            return newTile
         //   console.log(newTile)
        })
    }
} 
export default TileSetCreator