//Ship prefab
class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x ,y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   //add an object to existing scene, displayList, updateList
        this.points = pointValue;
    }

    update() {
        //move ship left
        this.x -= game.settings.shipSpeed;
        //wraparound screen bounds
        if(this.x <= 0 - this.width + 40) {
            this.x = game.config.width - 10;
        }
    }

    reset() {
        this.x = game.config.width;
    }

}