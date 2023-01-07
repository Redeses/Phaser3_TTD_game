

//used to handle the different attacks of the tanks
export default class Attack extends Phaser.GameObjects.Sprite{

    constructor(scene){
        super(scene)
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'mine');
        this.scale=0.05;
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.hits=5;

        this.gameSpeedMod
        this.speed1;
        this.targetE
        
        this.typeOf;
        this.damage;
        this.destroyB;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    }

    setContext(type,damage,destroy,scale,mod,enemy){
        this.typeOf=type;
        this.damage=damage;
        this.destroyB=destroy;
        this.speed1=this.speed*mod
        this.scale=scale;
        this.targetE=enemy;
        if(this.typeOf===3){
            this.lifespan=20000
            Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'mine');
        }else if(this.typeOf===4){
            this.lifespan=10000
            Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'trench');
        }else{
            this.lifespan=300
            Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'ammo');
           
        }
    }

    selfDestruct(){
        this.setActive(false)
        this.setVisible(false)
    }
    
    //says whether the fired object is destroyd when hit
    //
    handleHit(){
        if(this.destroyB){
            this.setActive(false);
            this.setVisible(false);
        }if(this.typeOf===4){
            this.hits-=1
            if(this.hits<=0){
                this.setActive(false);
                this.setVisible(false);
    
            }
        }

    }

    getAttack(){
        return [this.typeOf,this.damage]
    }

    //called when round ends
    remove(){
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }



    //used to set a trench at a given location. Used by Digger tank
    slowDown(location){
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(location[0], location[1]);


    }


    //used by mine tank. Kept as seperate functions even though identical, for future development
    dropMine(location){
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(location[0], location[1]);
    
    }

    //used to fire tank projectiles
    launch(x,y,angle){
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        var truAngle=(3.14159/180)*90+angle
        this.setRotation(truAngle);
       
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        
        this.lifespan = 300;
    }


    followEnemy(){
        console.log(this.targetE+this.targetE)
        var angle=Phaser.Math.Angle.Between(this.x,this.y,this.targetE.x,this.targetE.y)
        var truAngle=(3.14159/180)*90+angle
        this.setRotation(truAngle);
       
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
    }

    update(time,delta){
        this.lifespan -= delta;
        if(this.typeOf===2){
            this.x += this.dx * (this.speed1 * delta);
            this.y += this.dy * (this.speed1 * delta);
        
        }
        if(this.typeOf===1){
            this.followEnemy()
            this.x += this.dx * (this.speed1 * delta);
            this.y += this.dy * (this.speed1 * delta);

        }
        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }

    }
}