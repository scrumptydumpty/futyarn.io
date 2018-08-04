// defined in gamecanvas.html
const {WIDTH, HEIGHT, TICK, hitBoxMap, SPEED} = require('./gamelogic');

class Ball {

    constructor() {
      
        this.x = 600;
        this.y = 0;
        this.dx = 0;
        this.dy = .4;
        this.playerLastTouched = null;
    }

    setPos(x,y,dx,dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    reset() {
        this.x = 600;
        this.y = 0;
        this.dx = 0;
        this.dy = .4;
        this.playerLastTouched = null;
        
    }

    catHeadCollides(player) {
        if(!player) return;
        var currentCenterX = player.x + hitBoxMap[player.rotation][0];
        var currentCenterY = player.y + hitBoxMap[player.rotation][1];
        var ballCenterX = this.x + 5;
        var ballCenterY = this.y + 5;
        var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY), 2));
        
        const playerDx = Math.cos(player.rotation * Math.PI / 180) * SPEED;
        const playerDy = -Math.sin(player.rotation * Math.PI / 180) * SPEED;
       

        if(ballCenterDelta < 11){
            this.playerLastTouched = player.id;
           
            this.dx += 1.05 * playerDx - this.dx;
            this.dy += 1.05 * playerDy - this.dy;
            
            if (player.kicking) {
                
                // very slight random offset while kicking to keep things interesting
                const xdiff = (Math.floor(Math.random() * 300) - 150) / 500;
                const ydiff = (Math.floor(Math.random() * 300) - 150) / 500;
                
                // new velocity based on player rotation
                const dx = Math.cos(player.rotation * Math.PI / 180);
                const dy = Math.sin(player.rotation * Math.PI / 180);

                // pump up velocity, push ball out along kick direction
                this.dx = dx+xdiff;
                this.dy = dy+ydiff;

                this.x += Math.floor( (3* this.dx)  );
                this.y += Math.floor( (3 * this.dy)  );
            }
        } 
    }

    catBodyCollides (player) {
        if (!player) return;
        var currentCenterX = player.x + 50;
        var currentCenterY = player.y + 50;
       
        var ballCenterX = this.x + 5;
        var ballCenterY = this.y + 5;

        var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY), 2));

        if (ballCenterDelta < 12){
            this.playerLastTouched = player.id;
            const playerDx = Math.cos(player.rotation * Math.PI / 180) * SPEED;
            const playerDy = -Math.sin(player.rotation * Math.PI / 180) * SPEED;
            this.dx += 1.1 * playerDx - this.dx;
            this.dy += 1.1 * playerDy - this.dy;
        }
    }

    isGoal(){
        var x = this.x;
        var y = this.y;
        // returns goal
        if (y > 250 && y < 400) {
            if (x < 55) {
                return '0';
            } else if (x > (WIDTH - 55)) {
                return '1';
            }
        }
        return false;
    }

    handleWallBounce () {
        var x = this.x;
        var y = this.y;
        
        //handle horizontal bounce
        if (x < 55 || x > (WIDTH - 55)) {
            this.x -= Math.floor( ((2 * this.dx)) * TICK );
            this.dx -= (2 * (this.dx));
          
        }
        // returns vertical bounce
        if (y < 0 || y > (HEIGHT - 10)) {
            this.y -= Math.floor( ((2 * this.dy)) * TICK );
            this.dy -= (2 * (this.dy));
         
        }
    }

    move () {
        this.x += this.dx * TICK  ;
        this.y += this.dy * TICK  ;

        //friction on y axis
        if (Math.abs(this.dy) > 0.02) {
            if (this.dy > 0) {
                this.dy -= .0021;
            } else {
                this.dy += .0021;
            }
        } else {
            this.dy = 0;
        }
        //friction on x axis
        if (Math.abs(this.dx) > 0.02) {
            if (this.dx > 0) {
                this.dx -= .0021;
            } else {
                this.dx += .0021;
            }
        } else {
            this.dx = 0;
        }
    }

    draw(ctx){

        ctx.beginPath();
        ctx.arc(this.x, this.y, 7, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#8b0000';
        ctx.stroke();
       
    }
}

module.exports.Ball = Ball;