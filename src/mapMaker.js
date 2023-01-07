

//used for making a grid of the map as a matrix and making the paths shorther
export default class Mapmaker{

    constructor(){
        this.map=[]
        this.mod=120;
    }
/*for(var i = 0; i < game.config.height/32; i++) {
        graphics.moveTo(0, i * 32);
        graphics.lineTo(game.config.width, i * 32);
    }
    for(var j = 0; j < game.config.width/32; j++) {
        graphics.moveTo(j * 32, 0);
        graphics.lineTo(j * 32, game.config.height);
    } */

    //makes matrix out of the playing field that tells where player can or can't but a tower
    towerGridMaker(game, path,gridsize){
        var proxy=[];
        var x1=0,y1=0,y2=0,x2=0;
        for(var i = 0; i < game.config.height/gridsize; i++) {
            y1=i*gridsize;
            y2=(i+1)*gridsize
            for(var j = 0; j < game.config.width/gridsize; j++) {
                x1=j*gridsize;
                x2=(j+1)*gridsize
                if(i>15 && j>21){
                    proxy.push(1)
                }
                else if(i<4 && j<5){
                    proxy.push(1)
                }
                else if(this.checkMap(path.curves,x1,y1,x2,y2)){
                    proxy.push(1);
                }else{
                    proxy.push(0); 

                }   
            }
            this.map.push(proxy)
            proxy=[];
        }

        //console.log(this.map)
        return this.map;
    }

  //  console.log(this.path.curves[0].p0.x)
    checkMap(pathC,x1,y1,x2,y2){
        var z1
        var z2
        var c1
        var c2
        var bool=false
        pathC.forEach(element => {
            var z1=element.p1.x
            var z2=element.p0.x
            var c1=element.p1.y
            var c2=element.p0.y
            if(this.intersects(x2,y1,x1,y2,z1,c1,z2,c2)){
                bool= true;
                return;
            }
            
            
            if(this.intersects(x1,y1,x2,y2,z1,c1,z2,c2)){
                bool= true;
                return;
            }
        });
        return bool;
    }


    //checks lenght of a line given as an path element
    checkPathLenght(element){
        var z1=element.p1.x
        var z2=element.p0.x
            var c1=element.p1.y
            var c2=element.p0.y
            var a= z2-z1
            var b= c2-c1
            //console.log(Math.sqrt(a*a+b*b))
            return Math.sqrt( a*a + b*b );
    }

    //checks if the vector is still on the path given
    onThePath(x,y,endx,endy,modx,mody){
        //console.log(x+" "+y+" "+endx+" "+endy+" "+modx+" "+mody)
        if(modx){
            if(x<endx){
                return false
            }
        }else{
            if(x<endx){
                return false
            }
        }
        if(mody){
            if(y<endy){
                return false
            }
        }else{
            if(y<endy){
                return false
            }
        }

        return true;
    }

    //var pathvector={x:(pathC.p1.x-pathC.p0.x)/pathlength ,y:(pathC.p1.y-pathC.p0.y)/pathlength}
    //takes a general path and breaks it into smaller pieces per line
    //this is done to have the game work functionally better as both Digger tank and Mine tank use the centers
    //of the smalle paths to do their attack
    makeBetterPath(path,scene){
        var i=0
        var newPath=0;
        path.curves.forEach(element => {
            var x1=element.p1.x
            var x0=element.p0.x
            var y1=element.p1.y
            var y0=element.p0.y
            if(i===0){
                newPath=scene.add.path(x0,y0)
                i++;
            }
            var pathlength=this.checkPathLenght(element)
            
            var pathvector={x:((x1-x0)/pathlength) ,y:((y1-y0)/pathlength)}
            for(var j=0;j<pathlength/this.mod;j++){
                var newx=x0+pathvector.x*this.mod*j
                var newy=y0+pathvector.y*this.mod*j
                newPath.lineTo(newx,newy);
                //console.log("newx : "+newx+ "  newy:"+newy)
            }
            newPath.lineTo(x1,y1);
            
            
            
            
        });
        console.log(newPath)
        return newPath;
    }

    //Taken from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    //the first answer. USed to check whether two line intersect. This is needed to figure out the mapping of the 
    //tower defence map: line (x1,y1)->(x2,y2) and (z1,c1)->(z2,c2)
    intersects(x1,y1,x2,y2,z1,c1,z2,c2) {
        var det, gamma, lambda;
        det = (x2 - x1) * (c2 - c1) - (z2 - z1) * (y2 - y1);
        if (det === 0) {
          return false;
        } else {
          lambda = ((c2 - c1) * (z2 - x1) + (z1 - z2) * (c2 - y1)) / det;
          gamma = ((y1 - y2) * (z2 - x1) + (x2 - x1) * (c2 - y1)) / det;
          return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
      };


}