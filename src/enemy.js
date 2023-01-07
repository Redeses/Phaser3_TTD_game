



export default class Enemy extends Phaser.GameObjects.Sprite{
    
    constructor(scene, locationX, locationY,spriteO){
        super(scene,locationX,locationY, spriteO);
        
        this.scale=0.1
        this.speed=5/100000;
        this.health;
        this.typeOf;
        this.worth;
        this.score;
        this.game;
        this.path;
        this.config;
        this.game;
        this.scene=scene
        this.direction={x:0,y:0}

        this.gameSpeedMod=1;
        
        //used to check if enemy is already given the money/destroeyd
        this.isDestroyed=false

        //slowdown
        this.slowed=false;
        this.slowDelta=-1;

        this.stateA;
        

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }

    giveContext(path,config,game,type,healthText){
        this.path=path;
        this.config=config;
        this.game=game;
        this.typeOf=type;
        this.gameSpeedMod=config.gameSpeedMod
        this.isDestroyed=false;
        this.setStats();
    }



    handleHit(eventArray){
        switch(eventArray[0]){
            //minitank attack
            case 1:
                return this.helth(eventArray[1])
                break;

            //tank attack
            case 2:
                return this.helth(eventArray[1])
                break;

            //miner
            case 3:
                return this.helth(eventArray[1])
                break;

            //digger
            case 4:
                if(!this.slowed){
                    this.slow(eventArray[1])
                }
                
                break;
            default:
                this.health=1
                this.worth=1
                this.score=1
                break;
            

        }
    }

    



    setStats(){
        //console.log(this.type)
        switch (this.typeOf){
            //yellow butterfly
            case 1:
                this.health=1
                this.worth=1
                this.score=1
                this.speed=this.speed
                this.scale=0.05
                this.anims.play("fly",true);
                break;

                //red butterfly
            case 2:
                this.health=6
                this.worth=2
                this.score=2
                this.speed=this.speed/1.5
                this.scale=0.1
                this.anims.play("fly2",true);
                break;

            //purple butterfly
            case 3:
                this.health=9
                this.worth=3
                this.score=4
                this.speed=this.speed/2
                this.scale=0.15
                this.anims.play("fly3",true);
                break;

            //black/gray butterfly
            case 4:
                this.health=14
                this.worth=5
                this.score=8
                this.speed=this.speed/3
                this.scale=0.2
                this.anims.play("fly4",true);
                break;
            default:
                this.health=1
                this.worth=1
                this.score=1
                Phaser.GameObjects.Image.call(this, this.scene, 0, 0,  'yellowB');
                break;
        }
        this.activate()
    }

  

    //changes helth and trigger destruction
    helth(change){
        console.log("teaking dmg")
        this.health-=change;
        console.log(change+" "+this.health)
        if(this.health<=0){
            return this.destroyedByEnemy()

        }
    }

    getvector(){
        return this.follower.vec
    }

    getHelth(){
    return this.health
    }

    
    //slowing of enemys movement functions. Used by the digger tanks trench
    setSlowdown(){
        if(!this.slowed){
            //console.log("slowdown")
            this.speed=this.speed/10;
        }
        
    }
    stopSlow(){
        
        
        this.speed=this.speed*10
    }

   


    setA(bool){
        this.setActive(bool)
    }



    

    startOnPath(){
        this.follower.t = 0;
            
            // get x and y of the given t point            
        this.path.getPoint(this.follower.t, this.follower.vec);
            
            // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }


  
    //called when destroyed by a tank
    destroyedByEnemy(){
        if(this.isDestroyed){
            return 0;
        }
        this.isDestroyed=true
     
        return this.worth
    }

    activate(){
        this.setActive(true);
            this.setVisible(true);
    }
    deActivate(){
        this.setActive(false);
            this.setVisible(false);
    }

    //called when reaching the end of the path
    enemyDestroy(){
        if(this.isDestroyed){
            return 0;
        }
        this.isDestroyed=true
       
        return this.worth
    }

    //used to call for the instance of the enemy to be slowed
    slow(){
        
        this.setSlowdown();
        this.slowed=true
    }

    getWorth(){
        return this.worth    
    }

    //setsButterflies angle
    setTheAngle(x1,y1,x2,y2){
        
        var angle=Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y);
        var truAngle=(3.14159/180)*90+angle
        this.setRotation(truAngle);

    }

    update(time,delta){
        if(this.isDestroyed){
            this.setActive(false);
            this.setVisible(false);
        }else {
           
        this.follower.t += this.speed * delta*this.config.gameSpeedMod;
            
            // get the new x and y coordinates in vec
            this.path.getPoint(this.follower.t, this.follower.vec);
            // update enemy x and y to the newly obtained x and y
            
            this.setTheAngle(this.x,this.y,this.follower.vec.x,this.follower.vec.y)
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            // if we have reached the end of the path, remove the enemy
            if (this.follower.t >= 1|| this.x>880)
            {
                //not config is actually game scene from main
                this.config.changeHealth(this.worth)
                
                this.setActive(false);
                this.setVisible(false);
                
            }

            if(this.slowed && this.slowDelta<time && this.slowDelta===-1){
                this.slowDelta=time+5000;
            } 
            //console.log(time+" "+ this.slowDelta+" "+ this.slowed)
            if(this.slowed && time>this.slowDelta&& this.slowDelta!==-1){
                this.slowDelta=-1
                this.stopSlow();
                this.slowed=false;
            }

             

            
            
        }



    }

}