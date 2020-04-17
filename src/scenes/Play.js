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
        // load spritesheet
        this.load.spritesheet('shipExplosion', './assets/shipExplosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 8});

    }

    create() {
        //place tile sprite
        this.sea = this.add.tileSprite(0, 0, 640, 480, 'sea').setOrigin(0, 0);


        //maroon UI background
        this.add.rectangle(37, 42, 566, 64, 0x800000).setOrigin(0, 0);

        //add cannnon (p1)
        this.p1Cannon= new Cannon(this, game.config.width/2, 435, 'cannon').setScale(0.7, 0.7).setOrigin(0, 0);

        //add ship (x2)
        this.ship01 = new Ship(this, game.config.width +192, 132, 'bigShip', 0, 30).setOrigin(0, 0);
        this.ship03 = new Ship(this, game.config.width, 260, 'bigShip', 0, 10).setOrigin(0, 0);

        //add small Ship (x1), increased points to 50
        this.smallShip01 = new smallShip(this, game.config.width -10, 196, 'smallShip', 0, 50).setOrigin(0, 0);

        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);  

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
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        }, null, this);      
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }    
        
        this.sea.tilePositionX +=2;
        
        if (!this.gameOver) {               
            this.p1Cannon.update();         // update cannon sprite
            this.ship01.update();           // update ships (x3)
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