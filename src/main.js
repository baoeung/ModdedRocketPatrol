let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

//reserve some keyboard variable
let keyF, keyLEFT, keyRIGHT;

// define game settings
game.settings = {
    shipSpeed: 3,
    gameTimer: 60000,
    gameClock: 45
}