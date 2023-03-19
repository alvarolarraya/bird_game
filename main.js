import { Background } from './background.js';
import {Bird} from './bird.js';
import {Witch} from './enemies.js'

// its the same as using getElementById('canvas1')
const canvas = canvas1;
const context = canvas.getContext('2d');
window.addEventListener('load',function(){
    class Game {    
        constructor(){
            this.width = canvas.width;
            this.height = canvas.height;
            this.setDefaultParameters();
        }

        setDefaultParameters(){
            this.bird = new Bird(this);
            this.witch = new Witch(this);
            this.background = new Background(this);
            this.second = 0;
            this.gameOver = false;
            this.secondsInterval = setInterval(() =>{
                this.second++;
            },1000);
        }

        update(){
            if(!this.gameOver)
            {
                this.background.update();
                this.witch.update();
                if(!this.bird.dizzy)
                    this.checkEnemiesCollisions();
                this.checkWindCollisions();
                this.checkEnemiesHit();
                this.bird.update();
            }
        }

        draw(){
            this.background.draw(context);
            context.fillText(this.second,20,17,10,3);
            this.witch.draw(context);
            this.bird.draw(context);
        }

        accelerateBackground(){
            this.background.accelerate();
        }

        decelerateBackground(){
            this.background.decelerate();
        }

        checkEnemiesCollisions(){
            if(this.witch.checkCollisions(this.bird)) 
                this.bird.substractLife();
        }

        checkWindCollisions(){
            if(this.background.checkWindCollisions(this.bird))
                this.bird.getPushedByWind();
        }

        checkEnemiesHit(){
            this.witch.checkEnemiesHit(this.bird.syringes);
        }

        async checkGameOver(context){
            if(this.bird.lifes == 0 && !this.gameOver){
                this.gameOver = true;
                clearInterval(this.secondsInterval);
                Swal.fire({
                    title: 'GAME OVER',
                    confirmButtonText: "Try again",
                    confirmButtonColor: "black",
                    backdrop:`
                        url("./imgs/witch.gif")
                        top
                        no-repeat`
                }).then((result) => this.setDefaultParameters());
            }else if(this.witch.life == 0 && !this.gameOver){
                this.gameOver = true;
                clearInterval(this.secondsInterval);
                Swal.fire({
                    title: 'YOU WON!',
                    confirmButtonText: "Play again",
                    confirmButtonColor: "black",
                    backdrop:`
                        url("./imgs/win.gif")
                        top
                        no-repeat`
                }).then((result) => this.setDefaultParameters());
            }
        }
    }

    function main(){
        context.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw();
        game.checkGameOver(context)
        // main will run 60 times every second to refresh the diplay
        requestAnimationFrame(main);
    }
    const game = new Game();
    main();
})
    