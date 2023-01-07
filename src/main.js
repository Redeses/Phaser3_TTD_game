//import "./style.css";
import { Scene } from "phaser";
import Enemy from "./enemy"
import Attack from "./fire";
import Mapmaker from "./mapMaker";
import Tank from "./tank";
import CommonDataManager from "./utilStatKeeper.js"

let game;
let dataKeeper=CommonDataManager.getInstance()

const gameOptions = {
  enemyspeed:500,
  firingSpeedDefault:4,
  colorCodeAvailable:0x00008b,
  colorCodeUnavailable:0xff0000
};

//TODO attack,digger, animations, and adding music



window.onload = function () {
 
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#000000",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 900,
      height: 800
    },
    parent:"game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0
        }
      }
    },
    scene: PlayGame
  }
  game = new Phaser.Game(gameConfig);
  
  
  window.focus();
};

var mapM=new Mapmaker;


class Menu extends Phaser.Scene{
  constructor(){
    super("Menu")
  }

  preload(){

  }
  
  
  create() {
    console.log("here");
    this.time.addEvent({
      delay: 3000,
      loop: false,
      callback: () => {
        console.log("done")
          this.scene.start(PlayGame);
      }})
  }

  

}



class PlayGame extends Phaser.Scene {

  constructor(){
    super("PlayGame")
    this.score=0;
    this.gameMap;
    this.tankSelected=1;
    this.currentE=0;
    this.enemyArray;
    this.path;
    this.round=0;
    this.roundAmount=0;
    this.noRound=true;
    this.autoMoneyTime=0;

    this.startingOptions
    this.helth
    this.money
    this.score=0
    this.moneyText;
    this.helthText;
    this.scoreText;
    this.roundText
    this.tankInfoText;

    this.dificulty=0;

    this.playBool=false;
    this.currentI;

    this.music1,this.music2,this.music3;
    this.gameSpeedMod=1;
    this.gameSpedUp=false;
    this.speedButton
    this.coinsPerRound=5

    this.cliked;

    this.loreText="";
    this.loreSet=false;


    

    

  }
  preload() {
    
    this.load.image("background", require("./assets/Map.png"));

    this.load.image("mainmenu", require("./assets/Menu.png"));
    this.load.image("sidemenu", require("./assets/sideMenu.png"));
    this.load.image("map2", require("./assets/Map2.png"));
    this.load.image("trench", require("./assets/trench.png"));
    
    this.load.image("mine", require("./assets/Mine.png"));
    //this.load.image("yellowB", require("./assets/YBF2.png"));
   //his.load.image("redB", require("./assets/RBF2.png"));
    //this.load.image("purpleB", require("./assets/PBF2.png"));
    //this.load.image("blackB", require("./assets/BlackBF2.png"));
    this.load.image("minitank", require("./assets/Minitank.png"));
    //this.load.image("bigtank", require("./assets/TankFull.png"));
    //this.load.image("miner", require("./assets/MineTower1.png"));
    this.load.image("digger", require("./assets/TrenchDigger.png"));
    this.load.image("ammo", require("./assets/Ammo.png"));

    this.load.spritesheet("miner",require("./assets/mineSheet.png"),{
      frameWidth:802,
      frameHeight:802
    })
    this.load.spritesheet("yellowB",require("./assets/yeallowBSheet.png"),{
      frameWidth:353,
      frameHeight:374
    })
    this.load.spritesheet("redB",require("./assets/redBSheet.png"),{
      frameWidth:372,
      frameHeight:398
    })
    this.load.spritesheet("blackB",require("./assets/blackBSheet.png"),{
      frameWidth:372,
      frameHeight:370
    })
    this.load.spritesheet("purpleB",require("./assets/purpleBSheet.png"),{
      frameWidth:356,
      frameHeight:384
    })

    this.load.spritesheet("bigtank",require("./assets/BTSpritesheet.png"),{
      frameWidth:679,
      frameHeight:714
    })

    this.load.audio("music1", require('./assets/the-beat-of-nature-122841.mp3'));
    this.load.audio("music2", require('./assets/Sandy_peace.mp3'));
    this.load.audio("music3", require('./assets/Disturbed_future_run.mp3'));
    this.load.audio("tankfire", require('./assets/tankshot.mp3'));
   
    
  

    this.tankSelected=-1 
    
  }

  

  create() {
    
    this.setMusic(1)
    this.menu()
 

  }


  setMusic(trackNro){
    this.sound.stopAll();
    switch (trackNro){
      case 1:
        this.music1 = this.sound.add("music1", { loop: true});
        this.music1.play()
        break;

      case 2:
        this.music1 = this.sound.add("music2", { loop: true});
        this.music1.play()
        break;
        
      case 3:
        this.music1 = this.sound.add("music3", { loop: true});
        this.music1.play()
        break;
      
      default:
        this.music = this.sound.add("music1", { loop: true});
        this.music.play()
        
        break;  
    }
    
  }


  //next few functions are used in world creations

//makes world one
world1(){
  this.clearAll();
  this.setMusic(2)
  
  this.currentI=this.add.image(this.game.config.width/2,this.game.config.height/2,"background").setScale(0.8)
  var graphics1 = this.add.graphics();    
    this.path = this.add.path(750, -32);
    this.path.lineTo(750, 140);
    this.path.lineTo(570, 140);
    this.path.lineTo(570, 60);
    this.path.lineTo(270,60);
    this.path.lineTo(270,225);
    this.path.lineTo(400,225);
    this.path.lineTo(400,370);
    this.path.lineTo(75,370);
    this.path.lineTo(75,580);
    this.path.lineTo(600,580);
    this.path.lineTo(600,400);
    this.path.lineTo(900,400);
    graphics1.lineStyle(3, 0xffffff, 1);
    this.path=mapM.makeBetterPath(this.path,this)
    // visualize the path
    this.path.draw(graphics1);
    // the path for our enemies
    // parameters are the start x and y of our path
       
    this.drawGrid(graphics1);

    this.gameMap=mapM.towerGridMaker(game,this.path,32)

    this.enemyArray=dataKeeper.commonDificulty();
    this.startingOptions=dataKeeper.startingItems(this.dificulty)
    this.roundAmount=this.startingOptions.rounds
    this.helth=this.startingOptions.helth;
    this.money=this.startingOptions.money;
    this.backToMenuButton();
    this.switchSpeedButton();
    this.addOtherThings()
    this.makeSideMenu();
    
    this.playBool=true
}
//makes map 2
world2(){
  this.clearAll();
  this.setMusic(3)
  this.currentI=this.add.image(game.config.width/2,game.config.height/2,"map2").setScale(0.8)
  var graphics1 = this.add.graphics();
    this.path = this.add.path(200, -32);
    this.path.lineTo(220,680);
    this.path.lineTo(480,680);
    this.path.lineTo(750,140);
    this.path.lineTo(450,140);
    this.path.lineTo(450,-32);
    this.path=mapM.makeBetterPath(this.path,this)
   
    graphics1.lineStyle(3, 0xffffff, 1);
    // visualize the path
    //this.path.draw(graphics1);
    // the path for our enemies
    // parameters are the start x and y of our path
    
    this.drawGrid(graphics1);

    this.gameMap=mapM.towerGridMaker(game,this.path,32)

    this.enemyArray=dataKeeper.commonDificulty();
    this.startingOptions=dataKeeper.startingItems(this.dificulty)
    this.roundAmount=this.startingOptions.rounds
    this.helth=this.startingOptions.helth;
    this.money=this.startingOptions.money;
    this.backToMenuButton();
    this.switchSpeedButton()
    this.makeSideMenu();
    this.addOtherThings()
    
    this.playBool=true
    
}


backToMenuButton(){
  this.firstMB= this.add.text(40, 25, 'Back to\n menu')
  .setOrigin(0.5)
  .setPadding(10)
  .setStyle({ backgroundColor: '#111' , fontSize:12})
  .setInteractive({ useHandCursor: true })
  .on('pointerover', () => this.firstMB.setStyle({ fill: '#f39c12' }))
  .on('pointerout', () => this.firstMB.setStyle({ fill: '#FFF' }))
  .on("pointerdown",this.gameLoss,this)
}

//makes a button that changes the gamespeed to 4 time the rate
switchSpeedButton(){
  this.speedButton=this.add.text(40, 100, '4x speed')
  .setOrigin(0.5)
  .setPadding(10)
  .setStyle({ backgroundColor: '#111' , fontSize:12})
  .setInteractive({ useHandCursor: true })
  .on("pointerdown",this.speedSwitch,this)
}

speedSwitch(){
  if(!this.gameSpedUp){
    this.gameSpeedMod=3;
    this.gameSpedUp=true
    this.speedButton.setStyle({ backgroundColor: '#a2a2a2'})
  }else{
    this.gameSpeedMod=1;
    this.gameSpedUp=false
    this.speedButton.setStyle({ backgroundColor: '#111'})
  }
}

//gives pictures of the worlds to click on. Pressing a picture will start that map
worldSelect(){
  this.playBool=false
  
  
  this.world1I=this.add.image(game.config.width/2-35, game.config.height/2-50,"background").setScale(0.15)

   this.world1I.setInteractive().on("pointerdown",this.world1,this)

   this.world1I=this.add.image(game.config.width/2-35, game.config.height/2+100,"map2").setScale(0.15)

   this.world1I.setInteractive().on("pointerdown",this.world2,this)
   this.add.text(game.config.width/2-80, game.config.height/2-140, 'selectWorld')
}


//3 difficulty settings functions
selectEasy(){
  this.dificulty=1
  this.firstMB.destroy()
  this.secondMB.destroy()
  this.thirdMB.destroy()
  this.difficultytext.destroy()
  this.worldSelect()

}

selectHard(){
  this.dificulty=3
  this.firstMB.destroy()
  this.secondMB.destroy()
  this.thirdMB.destroy()
  this.difficultytext.destroy()
  this.worldSelect()

}

selectMedium(){
  this.dificulty=2
  this.firstMB.destroy()
  this.secondMB.destroy()
  this.thirdMB.destroy()
  this.difficultytext.destroy()
  this.worldSelect()
}


showloer(){
  
  if(!this.loreSet){
    this.loreText.setVisible(true)
    this.loreSet=true
  }else if(this.loreSet){
    this.loreText.setVisible(false)
    this.loreSet=false
  }
}

//makes the main menu in the scene
menu(){
  this.clearAll();
  this.setMusic(1);
  this.add.image(game.config.width/2,game.config.height/2,"mainmenu").setScale(0.8)
    this.difficultytext=this.add.text(game.config.width/2-120, game.config.height/2-100, 'Select dificulty')
  this.firstMB= this.add.text(game.config.width/2-35, game.config.height/2-50, 'Easy')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on('pointerover', () => this.firstMB.setStyle({ fill: '#f39c12' }))
   .on('pointerout', () => this.firstMB.setStyle({ fill: '#FFF' }))
   .on("pointerdown",this.selectEasy,this)


   this.secondMB= this.add.text(game.config.width/2-35, game.config.height/2, 'Medium')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on('pointerover', () => this.secondMB.setStyle({ fill: '#f39c12' }))
   .on('pointerout', () => this.secondMB.setStyle({ fill: '#FFF' }))
   .on("pointerdown",this.selectMedium,this)

   this.thirdMB= this.add.text(game.config.width/2-35, game.config.height/2+50, 'Hard')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on('pointerover', () => this.thirdMB.setStyle({ fill: '#f39c12' }))
   .on('pointerout', () => this.thirdMB.setStyle({ fill: '#FFF' }))
   .on("pointerdown",this.selectHard,this)

   var text=""
    dataKeeper.getText().forEach(element=>{
      text+=element;
    })
    this.loreText=this.add.text(game.config.width/2-50, 100, text)
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#a2a2a2' ,fill:"#ffffff"})
    .setVisible(false)


   this.add.text(game.config.width-100, game.config.height-100, 'Deep Lore')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on("pointerdown",this.showloer,this)

  
   
}

//adds groups and text to the map
addOtherThings(){
  
  //enemy things
  this.butterflyGroup=this.physics.add.group({classType:Enemy,runChildUpdate:true})
  this.nextEnemy = 0;

  //tank things
  this.tankGroup=this.physics.add.group({classType:Tank,runChildUpdate:true})
  this.input.on('pointerdown', this.placeTank,this);


  //player health and money graphic
  var graphics1 = this.add.graphics();
  this.infoG=graphics1.fillRect(game.config.width-210, 10, 210, 80).fillStyle(0xffffff,1).setAlpha(.5)


  //player health
  this.add.text(game.config.width-180,15,"HEALTH",{fontSize:"30px",fill:"#000000"})
  this.helthText=this.add.text(game.config.width-60,15,this.helth,{fontSize:"30px",fill:"#000000"})

  //player currency
  this.add.text(game.config.width-180,50,"Money",{fontSize:"30px",fill:"#000000"})
  this.moneyText=this.add.text(game.config.width-60,50,this.money,{fontSize:"30px",fill:"#000000"})

  //player score
  this.add.text(game.config.width/2-35,15,"Score",{fontSize:"30px",fill:"#000000",backgroundColor:"#a2a2a2"}).setAlpha(0.5)
  this.scoreText=this.add.text(game.config.width/2+65,15,this.score,{fontSize:"30px",fill:"#000000",backgroundColor:"#a2a2a2"}).setAlpha(0.5)


  

  
  //attack things
  this.attacks= this.physics.add.group({ classType: Attack, runChildUpdate: true });
  this.physics.add.overlap(this.butterflyGroup, this.attacks, this.hitEnemy,null,this);

   //butterfly end point
   this.endpoint= this.physics.add.sprite(this.path.curves[this.path.curves.length-1].p1.x, this.path.curves[this.path.curves.length-1].p1.y, "mine").setScale(0.3);
   this.endpoint.setTint(0x000000).setAlpha(0)
   console.log(this.endpoint.x+" "+this.endpoint.y)
   this.physics.add.overlap(this.butterflyGroup, this.endpoint, this.gotAway,null,this);

  //adding animations
  this.anims.create({
    key:"fly",
    frames:this.anims.generateFrameNumbers("yellowB",
    {start:0, end:2})
    ,frameRate:4
    ,repeat:-1
  })
  this.anims.create({
    key:"fly2",
    frames:this.anims.generateFrameNumbers("redB",
    {start:0, end:2})
    ,frameRate:6
    ,repeat:-1
  })
  this.anims.create({
    key:"fly3",
    frames:this.anims.generateFrameNumbers("purpleB",
    {start:0, end:2})
    ,frameRate:2
    ,repeat:-1
  })
  this.anims.create({
    key:"fly4",
    frames:this.anims.generateFrameNumbers("blackB",
    {start:0, end:2})
    ,frameRate:1
    ,repeat:-1
  })
  this.anims.create({
    key:"mine",
    frames:this.anims.generateFrameNumbers("miner",
    {start:0, end:3})
    ,frameRate:3
    ,repeat:-1
  })
  this.anims.create({
    key:"tankshot",
    frames:this.anims.generateFrameNumbers("bigtank",
    {start:0, end:9})
    ,frameRate:4
    ,repeat:1
  })

  this.changeScore(0)
  }

//makes the side menu for the maps themselves
makeSideMenu(){
  
   //sideBar menu things
   this.exampleGroup=this.physics.add.group({classType:Tank,runChildUpdate:true})
   var graphics1 = this.add.graphics(); 
   graphics1.fillStyle(0xa2a2a2, 1);
   graphics1.fillRoundedRect(game.config.width-200, game.config.height-300, 200, 300, 32);
   graphics1.fillStyle(0xffffff, 1);

   graphics1.fillStyle(0x000000, 1);
   this.add.text(15, game.config.height-120, 'Tank information').setStyle({fontSize:14})
   this.tankInfoText=this.add.text(15,game.config.height-100,"",{fontSize:"12px",fill:"#ffffff"})
   this.infoG=graphics1.fillRoundedRect(0, game.config.height-140, 200, 120, 32).setAlpha(.5)
   graphics1.fillStyle(0xffffff, 1);
   this.sidemenu=this.add.image(game.config.width-80, game.config.height-120,"sidemenu").setScale(.5)
   
   //tank locations show as white squares and also the about their stats
   this.Dttext=' Digger\n cost:'+dataKeeper.tankCostJson().dt+' money \n range: 3 squares\n attack:non damaging\n slowing trench'

   this.BTtext= ' Bigtank\n cost: '+dataKeeper.tankCostJson().bt+' money  \n range:range 6 squares\n attack: penetraing \n slow missiles'
   
   this.minerTtext=' Miner\n cost: '+dataKeeper.tankCostJson().miner+' money \n range: 3 squares\n attack: drop 3 mines\n on the path\n that exlode on impact'

   this.MTtext= ' Minitank\n cost: '+dataKeeper.tankCostJson().mt+' money \n range:3 squares\n attack: quick missiles'

   
   this.roundText=this.add.text(game.config.width-150, game.config.height-40, 'Round: '+this.round).setStyle({fontSize:20, fill:"#000000", })

   //the interactable images of the tanks
   this.menubt=this.add.image(game.config.width-60, game.config.height-205,"bigtank").setScale(0.1)
   this.menumt=this.add.image(game.config.width-145, game.config.height-207,"minitank").setScale(0.1)
   this.menudt=this.add.image(game.config.width-55, game.config.height-110,"digger").setScale(0.1)
   this.menuminer=this.add.image(game.config.width-138, game.config.height-108,"miner").setScale(0.1)
   this.nextRound= this.add.text(game.config.width-100, game.config.height-270, 'Next Round')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on('pointerover', () => this.nextRound.setStyle({ fill: '#f39c12' }))
   .on('pointerout', () => this.nextRound.setStyle({ fill: '#FFF' }))

   this.nextRound.setInteractive().on("pointerdown",this.setUpNextRound,this)

   this.add.text(15, game.config.height-120, 'Tank information').setStyle({fontSize:14})
   this.tankInfoText=this.add.text(15,game.config.height-100,"",{fontSize:"12px",fill:"#ffffff"})
   this.infoG=graphics1.fillRoundedRect(0, game.config.height-140, 200, 120, 32).setAlpha(.5)
   
   this.menubt.setInteractive().on("pointerdown",function(pointer){
     
     if(dataKeeper.tankCostJson().bt>this.scene.money){

     }else{
       console.log("bigtank:2 selected")
      this.scene.cliked=this.scene.menubt
     //good tint for when where isin't enough money' :: this.scene.menumt.setTint(0xff0000);
     this.scene.setTankAvailable(false)
     this.scene.tankInfoText.setText(this.scene.BTtext)
     this.scene.menubt.setTint(gameOptions.colorCodeAvailable);
     this.scene.tankSelected=2
     }
   },this.scene);
   this.menumt.setInteractive().on("pointerdown",function(pointer){
     
     if(dataKeeper.tankCostJson().mt>this.scene.money){
       
     }else{
      this.scene.cliked=this.scene.menumt
       console.log("minitank:1 selected")
       this.scene.tankInfoText.setText(this.scene.MTtext)
       this.scene.setTankAvailable(false)
     this.scene.menumt.setTint(gameOptions.colorCodeAvailable);
      
     this.scene.tankSelected=1
   }
   },this.scene)
   this.menudt.setInteractive().on("pointerdown",function(pointer){
     if(dataKeeper.tankCostJson().dt>this.scene.money){
       
     }else{
     console.log("digger:4 selected")
     this.scene.cliked=this.scene.menudt
     this.scene.tankInfoText.setText(this.scene.Dttext)
     this.scene.setTankAvailable(false)
     this.scene.menudt.setTint(gameOptions.colorCodeAvailable);
     this.scene.tankSelected=4
     }
   },this.scene)
   this.menuminer.setInteractive().on("pointerdown",function(pointer){
     if(dataKeeper.tankCostJson().miner>this.scene.money){
       
     }else{
     console.log("miner:3 selected")
     this.scene.cliked=this.scene.menuminer
     this.scene.tankInfoText.setText(this.scene.minerTtext)
     this.scene.setTankAvailable(false)
     this.scene.menuminer.setTint(gameOptions.colorCodeAvailable);
     this.scene.tankSelected=3
     }
   },this.scene)

   this.setTankAvailable(false)
}

//clears all of the visible items from the sceen. Is called each time there is a
//transition between mnu and game
clearAll(){
  var all=this.sys.displayList.list
  if(this.butterflyGroup){

    this.butterflyGroup.getChildren().forEach(element=>{
      element.deActivate()
    });
  }

  if(this.attacks){
    this.attacks.getChildren().forEach(element=>{
      element.selfDestruct()
    });
  }
  if(this.tankGroup){
    this.tankGroup.getChildren().forEach(element=>{
      element.selfDestruct()
    });
  }

  if(this.exampleGroup){
    this.exampleGroup.getChildren().forEach(element=>{
      element.selfDestruct()
    });
  }
  all.forEach(element=>{
    element.visible=false
    element.active=false;
  })

  
}


changeHealth(amount){
  this.helth-=amount;
    this.helthText.setText(this.helth);
    if(this.helth<=0){
     this.gameLoss()
    }
}


//called when a butterfly reaches the finishing line to do damage to the player
  gotAway(endpoint,enemy){
    this.helth-=enemy.enemyDestroy();
    this.helthText.setText(this.helth);
    if(this.helth<=0){
     this.gameLoss()
    }
  }


  //ised to draw the game grid
  drawGrid(graphics) {
    graphics.lineStyle(1, 0x36454F, 0.8);
    for(var i = 0; i < game.config.height/32; i++) {
      graphics.moveTo(0, i * 32);
      console.log("sfa")
      graphics.lineTo(game.config.width, i * 32);
    }
    for(var j = 0; j < game.config.width/32; j++) {
      graphics.moveTo(j * 32, 0);
      graphics.lineTo(j * 32, game.config.height);
    }
    console.log("griddwan")
    graphics.strokePath();
}


//called when tank attack collides with enemy
hitEnemy(enemy,attack){
  if (enemy.active === true && attack.active === true) {
    //console.log(enemy)
    //console.log(attack)
    var attacktypeArr=attack.getAttack();
    attack.handleHit();    
    var money=enemy.getWorth()

    if(enemy.handleHit(attacktypeArr)){
      this.changeMoney(money)
      this.changeScore(money)
    }
}
}



 



//the following two functions are used to see if tank can be places on the clicked spot
  canPlaceTank=(i, j)=> {
    if(this.round>=this.roundAmount){
      return false
    }
    return this.gameMap[i][j] === 0;
  }

  placeTank(pointer){
    var i = Math.floor(pointer.y/32);
    var j = Math.floor(pointer.x/32);
    
    if(this.canPlaceTank(i,j) && this.tankSelected!=-1) {
        var tank = this.tankGroup.get();
        tank.giveContext(this,gameOptions,this.gameMap,this.tankSelected,this.butterflyGroup,this.attacks,this.path)

        if (tank)
        {
          
          this.changeMoney(-tank.getWorth())
            tank.setActive(true);
            tank.setV(true);
            tank.place(i, j);
            this.gameMap[i][j] = 1; 
        }   
        
    }
   
  }

  //changing money in back and on the screen
  changeMoney(mm){
    this.money+=mm
    this.moneyText.setText(this.money)
    this.setTankAvailable(true)
  }

  changeScore(score){
    this.score+=score;
    this.scoreText.setText(this.score)
  }




 

  makeEnemy(time){
    var enemy=this.butterflyGroup.get();
    console.log("making enemies:"+this.enemyArray[this.round][this.currentE])
    enemy.giveContext(this.path,this,game,this.enemyArray[this.round][this.currentE]);
        if (enemy)
        {
            
            
            // place the enemy at the start of the path
            enemy.startOnPath();
            
            this.nextEnemy = time + 2000;
        } 
  }

  gameWin(){
    var graphics1 = this.add.graphics();
   this.add.text(game.config.width/2-100, game.config.height/2-120, 'You Win!\n Final score:'+this.score).setStyle({fontSize:30, fill:"#000000"})
   this.infoG=graphics1.fillRect(game.config.width/2-200, game.config.height/2-150, 400, 300)
   
    this.firstMB= this.add.text(game.config.width/2, game.config.height/2, 'Back to menu')
   .setOrigin(0.5)
   .setPadding(10)
   .setStyle({ backgroundColor: '#111' })
   .setInteractive({ useHandCursor: true })
   .on('pointerover', () => this.firstMB.setStyle({ fill: '#f39c12' }))
   .on('pointerout', () => this.firstMB.setStyle({ fill: '#FFF' }))
   .on("pointerdown",this.gameLoss,this)
  }


  gameLoss(){
    this.helth=this.startingOptions.helth
    this.money=this.startingOptions.money;
    this.score=0;
    this.helthText.setText(this.helth);
    this.noRound=true;
    this.tankGroup.clear()
    this.finishRound()
    this.menu();
    
  }

  //called at the end of each round to stop tanks from firing and to remove all stray attack objects
  finishRound(){
    this.changeMoney(this.coinsPerRound)
    this.setTankAvailable(false)
    this.coinsPerRound=5+this.round*4
    if(this.round>=this.roundAmount){
      this.gameWin()
    }

  }

  

  setUpNextRound(){
    if(this.round>=this.roundAmount){

    }
    else if(this.noRound){
      this.round+=1;
      this.roundText.setText("Round: "+this.round)
      this.currentE=0;
      this.noRound=false;
    }
  }


//called to set tanks availability on the side menu. 
  setTankAvailable(moneyChange){
    if(this.money>dataKeeper.tankCostJson().miner-1){
      this.menubt.clearTint()
      this.menumt.clearTint()
      this.menudt.clearTint()
      this.menuminer.clearTint()
    }else if(this.money>dataKeeper.tankCostJson().bt-1){
      
      this.menubt.clearTint()
      this.menumt.clearTint()
      this.menudt.clearTint()
      
      this.menuminer.setTint(gameOptions.colorCodeUnavailable)
    
    }else if(this.money>dataKeeper.tankCostJson().dt-1){
     
      this.menubt.clearTint()
      this.menumt.clearTint()
      
      this.menudt.setTint(gameOptions.colorCodeUnavailable)
      this.menuminer.setTint(gameOptions.colorCodeUnavailable)
      
    }else if(this.money>dataKeeper.tankCostJson().mt-1){
      
      this.menumt.clearTint()
      this.menubt.setTint(gameOptions.colorCodeUnavailable)
      this.menudt.setTint(gameOptions.colorCodeUnavailable)
      this.menuminer.setTint(gameOptions.colorCodeUnvailable)

    }else{
      this.tankSelected=-1
      this.menubt.setTint(gameOptions.colorCodeUnavailable)
      this.menumt.setTint(gameOptions.colorCodeUnavailable)
      this.menudt.setTint(gameOptions.colorCodeUnavailable)
      this.menuminer.setTint(gameOptions.colorCodeUnavailable)
    }
    //reset the selected tank tint available
    if(this.tankSelected!==-1){
      this.cliked.setTint(gameOptions.colorCodeAvailable)
    }
      
    }

  
  

    testPrint(){
      var childr1=this.butterflyGroup.getChildren();
      var childr2=this.attacks.getChildren();
      childr1.forEach(element=>{
        console.log(element)
      })

      childr2.forEach(element=>{
        console.log(element)
        
      })
      
    }
  

  update(time,delta){
    //console.log(this.playBool)
    if(!this.playBool){

    }
    else if (time > this.nextEnemy && (this.enemyArray[this.round][this.currentE] && !this.noRound))
    {        
        this.makeEnemy(time)  
        this.currentE+=1
        //this.testPrint()
        if(time>this.autoMoneyTime){
          if(this.coinsPerRound<=0){

          }else{
            console.log(this.coinsPerRound)
          this.coinsPerRound-=1;
          this.changeMoney(1);
          this.autoMoneyTime=time+5000/this.gameSpeedMod
          
        }
        }
      }

      else if(this.butterflyGroup.countActive()===0 && !(this.enemyArray[this.round][this.currentE]) && !this.noRound){
        this.noRound=true;
        this.finishRound();
        
      }
      //console.log(this.butterflyGroup.countActive())
      

    

    
  }

  renderer(){}

  
}


