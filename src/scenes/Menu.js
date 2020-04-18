class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    } 
    
    create() {
        console.log(this);
        //display menu text
        this.add.text(20, 20, "Sea Patrol Menu");

        //menu display
        let menuConfig = {
            fontFamily: 'Apple Chancery',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY- textSpacer, 'SEA PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use ⟷ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer, 'Press ⟵ for Easy or ⟶ for Hard', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            shipSpeed: 3,
            gameTimer: 60000
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            shipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/select.wav'); //credit to InspectorJ from https://freesound.org/people/InspectorJ/sounds/352112/
        this.load.audio('sfx_explosion', './assets/explosion.wav'); //Credit to Anoemex from https://freesound.org/people/Anomaex/sounds/490266/
        this.load.audio('sfx_rocket', './assets/cannonShot.wav'); //Credit to Isaac200000 from https://freesound.org/people/Isaac200000/sounds/184650/
        //this.load.audio('bg_Play', './assets/playBG.mp3'); //Credit to ShadyDave from https://freesound.org/people/ShadyDave/sounds/325407/
      }

}