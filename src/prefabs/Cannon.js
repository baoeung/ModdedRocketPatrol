//Cannon prefab
class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x ,y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   //add an object to existing scene, displayList, updateList
        this.isFiring = false;      //track cannon's firing status
        this.sfx_rocket = scene.sound.add('sfx_rocket'); // add cannon sfx
    }

    update() {
        //left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >=47) {
                this.x -= 2;
            } else if(keyRIGHT.isDown && this.x <=598) {
                this.x += 2;
            }
        }
        //fire button (NOT spacebar)
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.isFiring = true;
            this.sfx_rocket.play();  // play sfx
        }
        //if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.y -= 2;
        }
        //rest on miss
        if(this.y <= 108) {
            this.isFiring = false;
            this.y = 431;
        }
    }

    //reset cannon to "ground"
    reset() {
        this.isFiring = false;
        this.y = 431;
    }

}