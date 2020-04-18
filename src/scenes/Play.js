var delayedSpeed;
var playBackgroundMusic;
var counter;
var text2;
var timedClock;
function updateTime() {
    if (counter > 0) {
        counter--;
        text2.setText('Time Left: ' + counter);
    }
}
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    } 

    preload() {
        //load images/tile sprite
        this.load.image('cannon', './assets/cannon.png');
        this.load.image('smallShip', './assets/smallShip.png');
        this.load.image('bigShip', './assets/bigShip.png');
        this.load.image('sea', './assets/sea.png');
        this.load.image('UI', './assets/UI.png');
        // load spritesheet
        this.load.spritesheet('shipExplosion', './assets/shipExplosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 8});
        this.load.audio('bg_Play', './assets/playBG.mp3'); //Credit to ShadyDave from https://freesound.org/people/ShadyDave/sounds/325407/
    }

    create() {
        //place tile sprite
        this.sea = this.add.tileSprite(0, 0, 640, 480, 'sea').setOrigin(0, 0);

        //add ship (x2)
        this.ship01 = new Ship(this, game.config.width +192, 132, 'bigShip', 0, 30).setOrigin(0, 0);
        this.ship03 = new Ship(this, game.config.width, 260, 'bigShip', 0, 10).setOrigin(0, 0);

        //add small Ship (x1), increased points to 50
        this.smallShip01 = new smallShip(this, game.config.width -10, 196, 'smallShip', 0, 50).setOrigin(0, 0);

        //places UI
        this.UI = this.add.tileSprite(0, 0, 640, 480, 'UI').setOrigin(0, 0);

        //add cannnon (p1)
        this.p1Cannon= new Cannon(this, game.config.width/2, 425, 'cannon').setScale(0.7, 0.7).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
        key: 'shipExplosion',
        frames: this.anims.generateFrameNumbers('shipExplosion', { start: 0, end: 8, first: 0}),
        frameRate: 30
        });

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Apple Chancery',
            fontSize: '23px',
            align: 'right',
        }
        this.scoreLeft = this.add.text(110, 50, this.p1Score, scoreConfig);
        this.scoreWords = this.add.text(50, 50, 'Score: ', scoreConfig )

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock2;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        }, null, this);
        
        //creates visible Timer counting down game time
        //text = this.add.text(x, y, 'text', { font: "28px Courier", fill: "#ffffff", align: "center" }).setOrigin(0,0);
        counter = game.settings.gameTimer/1000;
        text2 = this.add.text(470,52, 'Time Left: ' + counter, { font: "20px Apple Chancery"}).setOrigin(0,0);
        timedClock = this.time.addEvent({ delay: 1000, callback: updateTime, callbackScope: this, loop:true});

        //increases speed of ships after 30 seconds of play
        delayedSpeed = this.time.addEvent({ delay: 30000, callback: increaseShipSpeed, callbackScope: this, loop:false});
        function increaseShipSpeed() {
            game.settings.shipSpeed += 2;
        }


        //Plays background music on loop
        playBackgroundMusic = this.sound.add('bg_Play');
        playBackgroundMusic.play({loop:true});

    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            game.settings.shipSpeed = 3;   // resets ship speed
            playBackgroundMusic.stop(); 
            this.scene.restart();
        }    

        this.sea.tilePositionX +=2;
        
        if (!this.gameOver) {               
            this.p1Cannon.update();         // update cannon sprite
            this.ship01.update();           // update ships (x2)
            this.ship03.update();
            this.smallShip01.update();      // update small Ship
        } 

        // check collisions
        if(this.checkCollision(this.p1Cannon, this.ship03)) {
            this.p1Cannon.reset();
            this.shipExplode(this.ship03);
         }
        if (this.checkCollision(this.p1Cannon, this.ship01)) {
            this.p1Cannon.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Cannon, this.smallShip01)) {
            this.p1Cannon.reset();
            this.shipExplode(this.smallShip01);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            playBackgroundMusic.stop();     //stops background music once scene goes back to menu
            this.scene.start("menuScene");
        }
    }

    checkCollision(cannon, ship) {
        // simple AABB checking
        if (cannon.x < ship.x + ship.width && 
            cannon.x + cannon.width > ship.x && 
            cannon.y < ship.y + ship.height &&
            cannon.height + cannon.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'shipExplosion').setOrigin(0, 0);
        boom.anims.play('shipExplosion');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}