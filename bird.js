import { InputHandler } from "./input.js";

const srcImageWidth = 300;
const srcImageHeight = 300;
const rescalingFactor = 51.59;
const heartsWidth = 10;
const heartsHeight = 5;
const maxHearts = 3;
// number between 0 and 1
const swingVariation = 0.25;


export class Bird{
    spriteSheetX = 0;
    spriteSheetY = 0;
    speed = 3;
    changeAnimationCounter = 0;
    animationPeriod = 7;
    constructor(game){
        this.game = game;
        this.width = this.game.width*10/100;
        this.height = rescalingFactor*this.width/100;
        this.x = this.game.width/2-this.width*2;
        this.y = this.game.height/2;
        this.image = bird;
        this.input = new InputHandler();
        this.lifes = maxHearts;
        this.dizzy = false;
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
        this.changeAnimationCounter = (this.changeAnimationCounter+1)%this.animationPeriod;
        if(this.changeAnimationCounter == 0){
            this.spriteSheetX = (this.spriteSheetX+1)%4;
            if(this.spriteSheetX == 0) this.spriteSheetY = (this.spriteSheetY+1)%2;
        }
        if(this.spriteSheetY == 0) this.y += swingVariation;
        else this.y -= swingVariation;
    }

    draw(context){
        let translateHeartHorizontally = 3;
        for(let i=0; i<maxHearts; i++) {
            if(i>(this.lifes-1)){
                context.drawImage(empty_heart,translateHeartHorizontally,3,heartsWidth,heartsHeight);
            }else{
                context.drawImage(heart,translateHeartHorizontally,3,heartsWidth,heartsHeight);
            }
            translateHeartHorizontally = translateHeartHorizontally+heartsWidth+3;
        }
        // to visualize colision area
        // context.strokeRect(this.x,this.y,this.width,this.height);
        if(this.dizzy)
        {
            context.globalAlpha = 0.5;
            context.drawImage(this.image,srcImageWidth*this.spriteSheetX,srcImageHeight*this.spriteSheetY,
                srcImageWidth,srcImageHeight,this.x,this.y,this.width,this.height);
            context.globalAlpha = 1;
            this.invincibleTime--;
            if(this.invincibleTime == 0)
                this.dizzy = false;
        }else{
            context.drawImage(this.image,srcImageWidth*this.spriteSheetX,srcImageHeight*this.spriteSheetY,
                srcImageWidth,srcImageHeight,this.x,this.y,this.width,this.height);
        }
    }

    substractLife(){
        if(this.lifes>0)
            this.lifes--;
        this.dizzy = true;
        this.invincibleTime = 100;
    }
}