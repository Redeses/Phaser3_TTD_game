

//holds current data shown or selected
//used also for utility purposes
export default class CommonDataManager {


    commonD=[[1,2,3,4],
    [1,1,2,2,1,1,1,1,3,3,2,2,1,1],
    [1,1,1,1,2,2,2,2,2,2,1,1,1,1,3,3,3,3,3],
    [1,1,1,1,2,2,2,2,2,3,3,3,3,4,3,2,1,1,1,3,3],
    [3,2,2,2,2,2,1,1,1,2,2,2,2,3,3,3,3,4,4,2,2,4,4],
    [1,2,2,3,3,3,3,3,4,4,2,2,2,2,2,3,3,3,3,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,2,2,2,3,3,3,3,3,1,1,1,1,2,2,3,3,3,3,3,3,3,3,2],
    [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,3,3,3,3,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,3,3,3,3,4,4,4,4,3,3,2,3,3,3,3,3,4,2,2,1,1,1,1,4,4],
    [4,4,4,1,1,2,2,2,2,2,3,3,3,4,4,4,4,4,4,4,2,3,3,3,4,4,4,4,4,4,4,4,4,4],
    [1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,4,4,4,4,3,3,2,3,3,3,3,3,4,2,2,1,1,1,1,4,4],
    [1,3,3,3,3,4,4,2,2,2,2,2,3,3,3,3,4,4,1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3],
    [1,3,3,4,4,2,2,2,2,2,3,3,3,3,4,4,1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [1,3,4,4,2,2,2,2,2,3,3,3,3,4,4,1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [1,1,1,3,3,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,4,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4],
    [1,1,1,3,3,2,2,1,1,4,4,1,4,4,4,4,1,4,4,4,1,4,4,4,1,4,4,4,1,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]]

    /*commonD=[[1,2,3,4],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1]]
*/
    startingStats={money:20,helth:50,rounds:6}
    startingStatsEasy={money:10,helth:100,rounds:8}
    startingStatsMedium={money:7,helth:60,rounds:12}
    startingStatsHard={money:5,helth:30,rounds:16}


    

    static myInstance = null;

    _funds = "";
    _score="";
    _difficulty="";
    _health=0;
    _rerun=true;
    _qb=false;



    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }

    commonDificulty(){
        return this.commonD
    }

    //epic lore text
    getText(){
        return [[" The Butterflies are invading!\n"],
        [" You are the leader of a military that spends trillions on its standing army\n"],
        [" Defend your land from these beatiful beatiful Butterflies\n"],
        [" Do not let them get to the end of their path\n or they will invade your cities\n"],
        [" Remember: Since you have the money, just use tanks!\n Leave the Lepidopterologist to play with their nets\n"]]
    }

    //gets difficulty 1=easy 2=medium 3=is hard
    startingItems(difficulty){
        switch(difficulty){
            case 1:
                return this.startingStatsEasy
                break;
            case 2:
                return this.startingStatsMedium
                break;
            case 3:
                return this.startingStatsHard
                break;
                
            default:
                return this.startingStats
                break
        
            }

        
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    tankCostJson(){
        return {mt:4,bt:10,dt:8,miner:14}
    }

    


}