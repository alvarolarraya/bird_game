const srcImageWidth = 608;


export class Background{
    normalSpeed = 2;
    minCloudSpawnTime = 200;
    maxCloudSpawnTime = 400;
    nextCloudRespawnTime = 0;
    actualTime = 0;
    constructor(game){
        this.game = game;
        this.image = background;
        this.x = 0;
        this.speed = this.normalSpeed;
        this.clouds = [];
    }

    update(){
        if(this.x <= -srcImageWidth) this.x = 0;
        else this.x -= this.speed;
        this.speed = this.normalSpeed;
        if(this.actualTime >= this.nextCloudRespawnTime){
            this.clouds.push(new Cloud(this.game,this.game.witch.x,this));
            this.nextCloudRespawnTime = this.calculateNextCloudSpawnTime();
        }
        this.actualTime++;
        this.clouds.forEach((cloud, index)=>{
            cloud.update();
            if(cloud.x+cloud.width<0)
                this.clouds.splice(index,1);
        })
    }

    draw(context){
        context.drawImage(this.image,this.x,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width+this.game.width,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width+this.game.width+this.game.width,0,
            this.game.width,this.game.height);
        this.clouds.forEach((cloud, index)=>{
            cloud.draw(context);
        })
    }

    accelerate(){
        this.speed++;
    }

    decelerate(){
        this.speed--;
    }

    calculateNextCloudSpawnTime(){
        return this.nextCloudRespawnTime+Math.random()*(this.maxCloudSpawnTime-
            this.minCloudSpawnTime+1)+this.minCloudSpawnTime;
    }

    checkWindCollisions(bird){
        for(let i=0;i<this.clouds.length;i++){
            let cloud = this.clouds[i];
            if(cloud.actualImageIndex == 1 && this.haveCollided(bird,cloud))
                return true;
        }
        return false;
    }

    haveCollided(object1,object2){
        if  (
                object1.x < object2.windX + object2.windWidth &&
                object1.x + object1.width > object2.windX &&
                object1.y < object2.windY + object2.windHeight &&
                object1.height + object1.y > object2.windY
            )
                return true;
        return false;
    }
}

class Cloud{
    rescalingFactor = 200;
    changeAnimationCounter = 0;
    animationPeriod = 60;
    spriteSheetX = 0;
    spriteSheetY = 0;
    images = [inhalingCloud,blowingCloud];
    actualImageIndex = 0;

    constructor(game,witch_x, background){
        this.game = game;
        this.background = background;
        this.image = blowingCloud;
        this.windImage = wind;
        this.width = 5*game.width/100;
        this.height = this.rescalingFactor*this.width/100;
        this.windWidth = this.width;
        this.windHeight = this.game.height-this.height;
        this.x = this.game.width;
        this.y = 0;
        this.windX = this.x;
        this.windY = this.y+this.height;
    }

    update(){
        if(this.changeAnimationCounter%this.animationPeriod == 0){
            this.actualImageIndex = (this.actualImageIndex+1)%2;
            this.image = this.images[this.actualImageIndex]
        }
        this.changeAnimationCounter++;
        this.x-=this.background.speed;
        this.windX-=this.background.speed;
    }

    draw(context){
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
        if(this.actualImageIndex == 1)
            context.drawImage(this.windImage,this.windX,this.windY,this.windWidth,this.windHeight);
    }
}