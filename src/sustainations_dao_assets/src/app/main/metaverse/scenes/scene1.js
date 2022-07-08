import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/Scene1/PNG/Back-01.png';
const bg2 = 'metaverse/scenes/Scene1/PNG/Mid-01.png';
const bg3 = 'metaverse/scenes/Scene1/PNG/Front-01.png';
const obstacle = 'metaverse/scenes/Scene1/PNG/obstacle-01-shortened.png';

const utility = 'metaverse/status_utility.png';
const selectAction = 'metaverse/selectAction.png';
const btnBlank = 'metaverse/btn-blank.png';

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super('Scene1');
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
    this.option1.text.setVisible(true);
    this.option2.setVisible(true);
    this.option2.text.setVisible(true);
  }

  triggerContinue(){
    this.veil.setVisible(false);
    this.selectAction.setVisible(false);
    this.option1.setVisible(false);
    this.option1.text.setVisible(false);
    this.option2.setVisible(false);
    this.option2.text.setVisible(false);
    this.isInteracting = false;
    this.isInteracted = true;
    this.player.play('running-anims');
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
    this.veil.setScrollFactor(0);
    this.veil.setVisible(false);
    this.selectAction.setScrollFactor(0);
    this.selectAction.setVisible(false);
    
    //option1
    this.option1 = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/2 -100, 'btnBlank').setScale(1.3);
    this.option1.text = this.add.text(gameConfig.scale.width/2, gameConfig.scale.height/2 -100, "Cut the bushes to open the way with a Knife", { fill: '#000000', align: 'center', fontSize: '30px' })
      .setScrollFactor(0).setVisible(false).setOrigin(0.5);
    this.option1.setInteractive();
    this.option1.setScrollFactor(0);
    this.option1.setVisible(false);
    this.option1.on('pointerdown', () => {
      
      this.triggerContinue();
      this.obstacle.setVisible(false);
    });

    //option2
    this.option2 = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/2, 'btnBlank').setScale(1.3);
    this.option2.text = this.add.text(gameConfig.scale.width/2, gameConfig.scale.height/2, "Try to make your way through the bushes without chopping them down", { fill: '#000000', align: 'center', fontSize: '30px' })
      .setScrollFactor(0).setVisible(false).setOrigin(0.5);
    this.option2.setInteractive();
    this.option2.setScrollFactor(0);
    this.option2.setVisible(false);
    this.option2.on('pointerdown', () => {
      this.triggerContinue();
    });

  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(350);
    }

    if (this.player.x > 1920*4+200) {
      this.scene.start("Scene2");
    }

    if (this.player.x > 1920*4 -1000 && this.isInteracted == false) {
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