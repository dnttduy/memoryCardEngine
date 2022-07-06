import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/Scene6/PNG/back-01.png';
const bg2 = 'metaverse/scenes/Scene6/PNG/mid-01-shortened.png';
const bg3 = 'metaverse/scenes/Scene6/PNG/front-01.png';
const obstacle = 'metaverse/scenes/Scene6/PNG/obstacle-01-shortened.png';

const utility = 'metaverse/status_utility.png';
const selectAction = 'metaverse/selectAction.png';
const btnBlank = 'metaverse/btn-blank.png';

export default class Scene6 extends Phaser.Scene {
    constructor() {
        super('Scene6');
    }

    clearSceneCache(){
        this.textures.remove('ground');
        this.textures.remove('background1');
        this.textures.remove('background2');
        this.textures.remove('background3');
        this.textures.remove('selectAction');
        this.textures.remove('utility');
        this.textures.remove('btnBlank');
        this.textures.remove('obstacle');
    }

    preload() {
        this.clearSceneCache();
        this.isInteracting = false;
        this.isInteracted = false;
        this.load.spritesheet("hero-running", heroRunningSprite, {
            frameWidth: 197,
            frameHeight: 337
        });
        this.load.image("ground", ground);
        this.load.image("background1", bg1);
        this.load.image("background2", bg2);
        this.load.image("background3", bg3);
        this.load.image("utility", utility);
        this.load.image("selectAction", selectAction);
        this.load.image("btnBlank", btnBlank);
        this.load.image("obstacle", obstacle);
    }

    //defined function
    triggerPause(){
        this.isInteracting = true;
        this.veil.setVisible(true);
        this.selectAction.setVisible(true);
        this.option1.setVisible(true);
    }


    create() {

        //background
        this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(0);
        
        this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(0);

        this.obstacle = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle")
            .setOrigin(0,0)
            .setScrollFactor(0);

            // platforms
        const platforms = this.physics.add.staticGroup();
        for (let x = -100; x < 1920*4; x += 1) {
            platforms.create(x, 950, "ground").refreshBody();
        }

        //player
        this.player = this.physics.add.sprite(-80, 700, "hero-running");
        this.player.setBounce(0.25);
        this.player.setCollideWorldBounds(false);
        this.physics.add.collider(this.player, platforms);



        this.anims.create({
            key: "running-anims",
            frames: this.anims.generateFrameNumbers("hero-running", {start: 1, end: 4}),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "idle-anims",
            frames: this.anims.generateFrameNumbers("hero-running", {start: 0, end: 0}),
            frameRate: 1,
            repeat: -1
        });
        this.player.play('running-anims');

        //frontlayer
        this.bg_3 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background3");
        this.bg_3.setOrigin(0, 0);
        this.bg_3.setScrollFactor(0);

        //utility
        this.utility = this.add.tileSprite(50, 0, 575, 964, "utility");
        this.utility.setOrigin(0, 0);
        this.utility.setScrollFactor(0);

        //mycam
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, gameConfig.scale.width*4, gameConfig.scale.height); //furthest distance the cam is allowed to move
        this.myCam.startFollow(this.player);


        //pause screen
        this.veil = this.add.graphics({x: 0, y: 0});
        this.veil.fillStyle('0x000000', 0.2);
        this.veil.fillRect(0,0, gameConfig.scale.width, gameConfig.scale.height);
        this.selectAction = this.add.image(0, 0, 'selectAction').setOrigin(0,0);
        this.option1 = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/2 -100, 'btnBlank').setScale(1.3);
        this.option1.setInteractive();

        this.veil.setScrollFactor(0);
        this.veil.setVisible(false);
        this.selectAction.setScrollFactor(0);
        this.selectAction.setVisible(false);
        this.option1.setScrollFactor(0);
        this.option1.setVisible(false);


        this.option1.on('pointerdown', () => {
            this.veil.setVisible(false);
            this.selectAction.setVisible(false);
            this.option1.setVisible(false);
            this.isInteracting = false;
            this.isInteracted = true;

            this.player.play('running-anims');
        });
    }

    update() {
        //new player logic
        if (this.player.body.touching.down && this.isInteracting == false) {
            this.player.setVelocityX(350);
        }

        if (this.player.x > 1920*4) {
            this.scene.start("Scene7");
        }

        if (this.player.x > 1920*3 && this.isInteracted == false) {
            this.triggerPause();
            this.player.setVelocityX(0);
            this.player.play('idle-anims');
            this.player.stop()
        }

        //bg
        // scroll the texture of the tilesprites proportionally to the camera scroll
        this.bg_1.tilePositionX = this.myCam.scrollX * .3;
        this.bg_2.tilePositionX = this.myCam.scrollX * .6;
        this.obstacle.tilePositionX = this.myCam.scrollX * .6;
        this.bg_3.tilePositionX = this.myCam.scrollX * 1;
    }
}