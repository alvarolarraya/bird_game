const srcImageWidth = 608;


export class Background{
    normalSpeed = 3;
    constructor(game){
        this.game = game;
        this.image = background;
        this.x = 0;
        this.speed = this.normalSpeed;
    }

    update(){
        if(this.x <= -srcImageWidth) this.x = 0;
        else this.x -= this.speed;
        this.speed = this.normalSpeed;
    }

    draw(context){
        context.drawImage(this.image,this.x,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width+this.game.width,0,this.game.width,this.game.height);
        context.drawImage(this.image,this.x+this.game.width+this.game.width+this.game.width,0,
            this.game.width,this.game.height);
    }

    accelerate(){
        this.speed++;
    }

    decelerate(){
        this.speed--;
    }
}