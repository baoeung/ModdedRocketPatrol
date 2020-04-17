//small Ship prefab
class smallShip extends Phaser.GameObjects.Sprite {
    constructor(scene, x ,y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   //add an object to existing scene, displayList, updateList
        this.points = pointValue;
    }

    update() {
        //move small Ship left
        this.x -= game.settings.shipSpeed + 1;
        //wraparound screen bounds
        if(this.x <= 0 - this.width + 40) {
            this.x = game.config.width - 10;
        }
    }

    reset() {
        this.x = game.config.width;
    }

}