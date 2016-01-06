// Taille du canvas
var canvasWidth = 1024;
var canvasHeight = 768;

// Création du Stage
var stage = new PIXI.Stage(0x000000);

// Création du mode de rendu.
var renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, {
    antialiasing:false,
    transparent:true,
    resolution:1
});

var div = document.getElementById('showExample');

div.appendChild(renderer.view);

// Ajouter l'élément de vue (le canvas) au DOM
//document.body.appendChild(renderer.view);

// Création du conteneur de la carte
var mapContainer = new PIXI.DisplayObjectContainer();

// Ajout du conteneur des cartes au stage
stage.addChild(mapContainer);

// Taille des Tiles sur la carte
var tileWidth = 100;
var tileHeight = 50;

// Taille des Tiles sur le tileset
var tileTextureWidth = 100;
var tileTextureHeight = 100;

// Chargement de la texture du tileset
var tilesetTexture = PIXI.Texture.fromImage('ayolan-tilesetIsometrique.png');

// Taille total du tileset
var tilesetTextureWidth = 400;
var tilesetTextureHeight = 300;

// Tableau contenant la liste des Tiles futurs découpés
var tileList = [];

for (var i = 0; i < tilesetTextureHeight / tileTextureHeight; i++) {
    for (var j = 0; j < tilesetTextureWidth / tileTextureWidth; j++) {

        // Calculate the Tile coordinate to cut
        var tilePosition = new PIXI.Rectangle(j * tileTextureWidth, i * tileTextureHeight, tileTextureWidth, tileTextureHeight);

        // Build the Tile texture
        var tTile = new PIXI.Texture(tilesetTexture.baseTexture, tilePosition);

        // Push the texture into table
        tileList.push(tTile);
    }
}

/**
 * Permet de généré une carte aléatoirement
 *
 * @param width         Largeur de la carte en Tile
 * @param height        Hauteur de la carte en Tile
 * @param tileMin       Numéro minimum des Tiles à utiliser
 * @param tileMax       Numéro maximum des Tiles à utiliser
 * @return {Array}      Renvoie le tableau contenant la carte généré
 */
function generateMap(width, height, tileMin, tileMax) {
    var out = [];

    for (var y = 0; y < height; y++) {

        out.push([]);

        for (var x = 0; x < width; x++) {
            out[y].push([]);

            out[y][x].push(Math.floor((Math.random() * tileMax) + tileMin));
        }
    }

    return out;
}

// Génération de la carte aléatoire
var map = generateMap(10, 10, 0, 10);

// Décalage perso
var offset = {
    x : canvasWidth / 2 - 50,
    y : 50
};

// Affichage des Tiles
for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
        var tile = new PIXI.Sprite(tileList[map[y][x]]);

        tile.position.x += (x - y) * (tileWidth / 2) + offset.x;
        tile.position.y += (x + y) * (tileHeight / 2) + offset.y;

        mapContainer.addChild(tile);

        // Rend la Tile interactive
        tile.interactive = true;

        // Création de la zone de collision avec la souris
        tile.hitArea = new PIXI.Polygon([
                new PIXI.Point(50, 25),
                new PIXI.Point(100, 50),
                new PIXI.Point(50, 50 + 25),
                new PIXI.Point(0, 50)]
        );

        // Application d'une teinte quand la souris survol la tile
        tile.mouseover = tile.touchstart = function(data){
            this.tint = 0xFAEBD7;
        };

        // Suppression de celle-ci une fois que la souris quitte la Tile
        tile.mouseout = tile.touchend = function(data){
            this.tint = 0xffffff;
        };
    }
}

// Démarrage de l'animation
requestAnimationFrame(animate);

// Fonction d'animation
function animate() {
    // render the stage
    renderer.render(stage);
    requestAnimationFrame(animate);
}