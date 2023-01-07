
import Attack from "./fire";
import CommonDataManager from "./utilStatKeeper";

const keeperS=CommonDataManager.getInstance();


//used for the mini tank class
export default class Tank extends Phaser.GameObjects.Sprite{
    
    constructor(scene, locationX, locationY,spriteO){
        super(scene,locationX,locationY, spriteO);
        

        this.scale=0.1


        this.range=0;
        this.damage=0;
        this.cost=0;
        this.scaleOfAmmo=0.1
        this.timeBetweenAttacks=0
        this.enemies;
        this.tanktype;
        this.roundRunning=false;
        
        this.group;
        this.attacks
        this.angle1;

        this.direction=0;
        this.patchV

        this.scene=scene
        this.game;
        this.config;
        this.map;
        this.path
        this.gameSpeedMod

        this.attackType;

        this.tankfire

        
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }

    //used to stop firing when round is not going on
  

   

    giveContext(game,confiq,map,type,group,attacks, path){
        this.game=game;
        this.config=confiq;
        this.map=map;
        this.tanktype=type;
        this.group=group;
        this.attacks=attacks
        this.path=path;
        this.gameSpeedMod=game.gameSpeedMod
        this.tankfire=this.game.sound.add("tankfire", { loop: false,volume: 0.5});
        this.setStat();
        
    }

    selfDestruct(){
        
        this.setActive(false)
        this.setVisible(false)
    }
    

    setStat(){
        switch (this.tanktype){
            //mini tank
            case 1:
                this.range=100
                this.damage=0.3
                this.cost=keeperS.tankCostJson().mt
                this.timeBetweenAttacks=100*this.gameSpeedMod
                this.scaleOfAmmo=0.05
                Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'minitank');
                break;

                //tank
            case 2:
                this.range=200
                this.damage=4
                this.cost=keeperS.tankCostJson().bt
                this.timeBetweenAttacks=1000*this.gameSpeedMod
                this.scaleOfAmmo=0.1
                Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'bigtank');
                break;

            //miner
            case 3:
                this.range=200
                this.damage=7
                this.cost=keeperS.tankCostJson().miner
                this.timeBetweenAttacks=5000*this.gameSpeedMod
                this.scaleOfAmmo=0.1
                this.setAnimationPlay()
                break;

            //digger
            case 4:
                this.range=300
                this.damage=0
                this.cost=keeperS.tankCostJson().dt
                this.timeBetweenAttacks=6000*this.gameSpeedMod
                this.scaleOfAmmo=0.1
                Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'digger');
                break;
            default:
                this.range=100
                this.damage=1
                this.cost=1
                this.timeBetweenAttacks=1000
                Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'minitank')
                break;

        }
        
    }



    getWorth(){
        return this.cost;
    }
   


    setV(bool){
        this.setVisible=bool;
    }

    //used to set when round is oging to have the tank stop attacking
    setIsRound(bool){
        this.roundRunning=true;
    }


    // we will place the turret according to the grid
    place(i, j) {          
        
        this.y = i * 32 + 32/2;
        this.x = j * 32 + 32/2;
        this.map[i][j] = 1;    
        this.nextTic=0;        
    }

    animationAndSound(){
        this.anims.play("tankshot",true);
        this.tankfire.play()
        
    }

    //makes the attack on the location
    addAttack(x, y, angle,enemy) {
        var attack = this.attacks.get();
        attack.setContext(this.tanktype,this.damage, (this.tanktype===1||this.tanktype===3),this.scaleOfAmmo,this.game.gameSpeedMod,enemy);
        if (attack)
        {
            attack.launch(x, y, angle);
            this.animationAndSound()
        }
    }

    //gets the location of the first enemy within range if there are any
    getEnemy(x, y, distance) {
        var enemyUnits = this.group.getChildren();
        for(var i = 0; i < enemyUnits.length; i++) {       
            if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
                return enemyUnits[i];
        }
        return false;
    }

    //used to start the attack toward the enemy and calculate the andgle of the attack
    fire(){
        var enemy = this.getEnemy(this.x, this.y, this.range);
        if(enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            //console.log(enemy.getvector().x)
            this.addAttack(this.x, this.y, angle,enemy);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
    }

    //finds the nearest math for the minetank tow drop its mines to that is within range
    findPathWithinrange(){
        var nearest=1000;
        var curve;
        //console.log(this.path)
        //console.log(this.path)
        this.path.curves.forEach(element => {
            var z1=element.p1.x
            var z2=element.p0.x
            var c1=element.p1.y
            var c2=element.p0.y
            var mx=(z1+z2)/2
            var my=(c1+c2)/2
            var a= mx-this.x
            var b= my-this.y
            var c = Math.sqrt( a*a + b*b );
            
            if(nearest>c){
                nearest=c;
                curve=element;
            }
        });
        if(nearest>this.range){
            return -1;
        }
        return curve;
    }

  

    //checks the lenght of the given path line
    checkPathLenght(element){
        var z1=element.p1.x
        var z2=element.p0.x
            var c1=element.p1.y
            var c2=element.p0.y
            var a= z2-z1
            var b= c2-c1
            return Math.sqrt( a*a + b*b );
    }

    //gets path curve and amoun of locations. From these it calculates locations for the mines on the path
    //distance between mines is 40 except if the curve is shorter than the distance will be lenght of curve/amount
    //will add pixel variation
    getMineLocations(pathC,amount){
        var pathlength=this.checkPathLenght(pathC)
        var locations=[]
        var pathvector={x:(pathC.p1.x-pathC.p0.x)/pathlength ,y:(pathC.p1.y-pathC.p0.y)/pathlength}
        var middlepoint={x:(pathC.p1.x+pathC.p0.x)/2, y:(pathC.p1.y+pathC.p0.y)/2}
        var angle = Phaser.Math.Angle.Between(this.x, this.y, middlepoint.x, middlepoint.y);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        if(pathlength/amount<40){
            for(let i=0;i<amount;i++){
                var rand1=CommonDataManager.myInstance.getRandomInt(5)/10
                locations.push([pathC.p0.x+(i+rand1)*pathvector.x,pathC.p0.y+(i+rand1)*pathvector.y])
            }
        }else{
            for(let i=0;i<amount;i++){
                var rand1=CommonDataManager.myInstance.getRandomInt(5)/10
                locations.push([middlepoint.x-40*pathvector.x*Math.floor(amount/2)+(i+rand1)*40*pathvector.x,middlepoint.y-40*pathvector.y*Math.floor(amount/2)+(i+rand1)*40*pathvector.y])
            }

        }
        return locations;
    }

    //drops 3 mines on the path that deal huge damage on contact
    dropMines(){
        var pathC=this.findPathWithinrange()
        if(pathC===-1){
        }else{
            var mineLocations=this.getMineLocations(pathC,3)
            mineLocations.forEach(element=>{
                var attack = this.attacks.get();
                attack.setContext(this.tanktype,this.damage, (this.tanktype===1||this.tanktype===3),this.scaleOfAmmo);
                if(attack){
                    attack.dropMine(element);
                }
            })
        }

    }

    //sets the facing direction of the digger tank. Currently obselete
    setDirection(){
        if(this.direction!==0){
            return;
        }
        var pathC=this.findPathWithinrange()
        var pathlength=this.checkPathLenght(pathC)
       
        var middlepoint={x:(pathC.p1.x+pathC.p0.x)/2, y:(pathC.p1.y+pathC.p0.y)/2}
        var angle=Phaser.Math.Angle.Between(this.x, this.y,middlepoint.x, middlepoint.y);
        var truAngle=(3.14159/180)*90+angle
        this.direction=truAngle
        var Vx = Math.cos(truAngle)
        var Vy = Math.sin(truAngle)
        this.patchV={x:Vx ,y:Vy}
        console.log(this.patchV)
        this.setRotation(truAngle);
        


    }

    //sets a line across the road at nearest point, which will slowdown the following 5 enemies to cross it
    slowDown(){
        var pathC=this.findPathWithinrange()
        if(pathC===-1){
        }else{
            var mineLocations=this.getMineLocations(pathC,1)
            mineLocations.forEach(element=>{
                var attack = this.attacks.get();
                attack.setContext(this.tanktype,this.damage, (this.tanktype===1||this.tanktype===3),this.scaleOfAmmo);
                if(attack){
                    attack.dropMine(element);
                }
            })
        }

    }

    //add animation to Mine tank
    setAnimationPlay(){
        console.log(this.type)
        this.anims.play("mine",true);
    }

/* attack angle
this.angle1=Phaser.Math.Angle.Between(this.body.x,this.body.y,x,y)
          this.body.velocity.x = this.maxspeed * Math.cos(this.angle1)
          this.body.velocity.y = this.maxspeed * Math.sin(this.angle1)
         */

    //called when tank gets to do it's attack in update
    attack(){
        if(this.tanktype===3){
            this.dropMines()
        }else if(this.tanktype===4){
            this.slowDown()
        }
        else{
            
            this.fire();
        }
        //this.aConeOfAttack();
        
    }

    

    update(time,delta){
        if(time > this.nextTic && !this.game.noRound) {
            this.attack();
            this.nextTic = time + this.timeBetweenAttacks/this.game.gameSpeedMod;
        }

    }

}