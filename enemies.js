export class Witch{
    rescalingFactor = 50;
    y = 10;
    verticalVariation = 0;
    verticalVariationFactor = 1.5;
    maxWartGroupRespawnTime = 240;
    minWartGroupRespawnTime = 30;
    minWartGroupSize = 3;
    maxWartGroupSize = 5;
    actualTime = 0;
    wartGroupSize = 3;
    constructor(game){
        this.game = game;
        this.image = witch;
        this.nextWartGroupRespawnTime = 0;
        this.nextWartGroupRespawnTime = this.calculateNextWartRespawnTime();
        this.width = this.game.width*25/100;
        this.height = this.rescalingFactor*this.width/100;
        this.x = this.game.width-this.width;
        this.warts = [];
    }

    update(){
        this.verticalVariation+=Math.PI/(2*50);
        let newY = this.y+this.verticalVariationFactor*(Math.sin(this.verticalVariation))
        if(newY<(this.game.height-this.height) && newY>0){
            this.y = newY;
        }
        // warts path forms a line between respawn point and other point in the 
        // left side of the screen on a vertical variable position
        if(this.nextWartGroupRespawnTime <= this.actualTime){
            let verticalPosition = 0;
            for(let i=0;i<this.wartGroupSize;i++){
                this.warts.push(new Wart(this,this.game,verticalPosition));
                verticalPosition += this.game.height/(this.wartGroupSize-1);
            }
            this.nextWartGroupRespawnTime=this.calculateNextWartRespawnTime();
            this.wartGroupSize = this.calculateNextWartGroupSize();
        }
        this.warts.forEach((wart, index)=>{
            wart.update();
        })
        this.actualTime++;
    }

    draw(context){
        this.warts.forEach((wart, index)=>{
            wart.draw(context);
        })
        // to visualize colision area
        // context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    calculateNextWartRespawnTime(){
        return this.nextWartGroupRespawnTime+Math.random()*(this.maxWartGroupRespawnTime-
            this.minWartGroupRespawnTime+1)+this.minWartGroupRespawnTime;
    }
    calculateNextWartGroupSize(){
        return Math.floor(Math.random()*(this.maxWartGroupSize-this.minWartGroupSize+1))+this.minWartGroupSize;
    }

    checkCollisions(bird){
        if(this.haveCollided(this,bird))
            return true;
        for(let i=0;i<this.warts.length;i++){
            let wart = this.warts[i];
            if(this.haveCollided(bird,wart)){
                this.warts.splice(i,1);    
                return true;
            }                
        }
        return false;
    }

    haveCollided(object1,object2){
        if  (
                object1.x < object2.x + object2.width &&
                object1.x + object1.width > object2.x &&
                object1.y < object2.y + object2.height &&
                object1.height + object1.y > object2.y
            )
                return true;
        return false;
    }
}

export class Wart{
    rescalingFactor = 50;
    speed = 2;

    constructor(witch,game,dstVerticalPosition){
        this.dstVerticalPosition = dstVerticalPosition;
        this.game = game;
        this.witch = witch;
        this.width = this.game.width*10/100;
        this.height = this.rescalingFactor*this.width/100;
        this.x = this.witch.x+this.witch.width/3;
        this.y = this.witch.y+this.witch.height/1.5-this.height;
        this.srcX = this.x;
        this.srcY = this.y;
        this.image = wart;
        this.slope = (this.srcY-this.dstVerticalPosition)/(this.srcX);
    }

    update(){
        this.x -= this.speed;
        this.y = this.srcY+this.slope*(this.x-this.srcX);
    }

    draw(context){
        // to visualize colision area
        // context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}