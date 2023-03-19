import { InputHandler } from "./input.js";

export class Bird{
    srcImageWidth = 300;
    srcImageHeight = 300;
    rescalingFactor = 51.59;
    heartsWidth = 10;
    heartsHeight = 5;
    maxHearts = 3;
    // number between 0 and 1
    swingVariation = 0.25;
    spriteSheetX = 0;
    spriteSheetY = 0;
    speed = 3;
    changeAnimationCounter = 0;
    animationPeriod = 7;
    coolDown = 0;   
    constructor(game){
        this.game = game;
        this.width = this.game.width*10/100;
        this.height = this.rescalingFactor*this.width/100;
        this.x = this.game.width/2-this.width*2;
        this.y = this.game.height/2;
        this.image = bird;
        this.input = new InputHandler();
        this.lifes = this.maxHearts;
        this.dizzy = false;
        this.syringes = [];
    }

    async update(){
        if(this.input.keys.includes('ArrowUp') && this.y>0) this.y = this.y-this.speed;
        else if(this.input.keys.includes('ArrowDown') && this.y<(this.game.height-this.height)) this.y = this.y+this.speed;
        if(this.input.keys.includes('ArrowRight') && this.x<(this.game.width-this.width)){
            this.x = this.x+this.speed;
            this.game.accelerateBackground();
        } 
        else if(this.input.keys.includes('ArrowLeft') && this.x>0){
            this.x = this.x-this.speed;
            this.game.decelerateBackground();
        }
        else if(this.input.keys.includes(' ') && this.coolDown == 0){
            this.syringes.push(new Syringe(this.game,this));
            this.coolDown = 60;
        }
        if(this.coolDown>0)
            this.coolDown--;            
        this.changeAnimationCounter = (this.changeAnimationCounter+1)%this.animationPeriod;
        if(this.changeAnimationCounter == 0){
            this.spriteSheetX = (this.spriteSheetX+1)%4;
            if(this.spriteSheetX == 0) this.spriteSheetY = (this.spriteSheetY+1)%2;
        }
        if(this.spriteSheetY == 0) this.y += this.swingVariation;
        else this.y -= this.swingVariation;
        this.syringes.forEach((syringe, index)=>{
            syringe.update();
            if(syringe.x+syringe.width>this.game.width)
                this.syringes.splice(index,1);
        });
    }

    draw(context){
        let translateHeartHorizontally = 3;
        for(let i=0; i<this.maxHearts; i++) {
            if(i>(this.lifes-1)){
                context.drawImage(empty_heart,translateHeartHorizontally,3,this.heartsWidth,this.heartsHeight);
            }else{
                context.drawImage(heart,translateHeartHorizontally,3,this.heartsWidth,this.heartsHeight);
            }
            translateHeartHorizontally = translateHeartHorizontally+this.heartsWidth+3;
        }
        // to visualize colision area
        // context.strokeRect(this.x,this.y,this.width,this.height);
        if(this.dizzy)
        {
            context.globalAlpha = 0.5;
            context.drawImage(this.image,this.srcImageWidth*this.spriteSheetX,this.srcImageHeight*this.spriteSheetY,
                this.srcImageWidth,this.srcImageHeight,this.x,this.y,this.width,this.height);
            context.globalAlpha = 1;
            this.invincibleTime--;
            if(this.invincibleTime == 0)
                this.dizzy = false;
        }else{
            context.drawImage(this.image,this.srcImageWidth*this.spriteSheetX,this.srcImageHeight*this.spriteSheetY,
                this.srcImageWidth,this.srcImageHeight,this.x,this.y,this.width,this.height);
        }
        this.syringes.forEach((syringe, index)=>{
            syringe.draw(context);
        })
    }

    substractLife(){
        if(this.lifes>0)
            this.lifes--;
        this.dizzy = true;
        this.invincibleTime = 100;
    }

    getPushedByWind(){
        if(this.y+this.height+2<this.game.height)
            this.y+=2;
    }
}

class Syringe{
    rescalingFactor = 25;
    speed = 3;

    constructor(game,bird){
        this.game = game;
        this.bird = bird;
        this.image = syringe;
        this.width = 8*this.game.width/100;
        this.height = this.width*this.rescalingFactor/100;
        this.x = this.bird.x;
        this.y = this.bird.y;
    }

    update(){
        this.x+= this.speed;
    }

    draw(context){
        // to visualize colision area
        // context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}