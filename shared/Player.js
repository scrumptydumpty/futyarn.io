const { TICK, catSpeed} = require('./gamelogic');

class Player {
    constructor(team,id){
        this.team = team;
        this.id = id;
        this.x = 200;
        this.y = 200;
        this.canvas = null; // client side used
        this.img = null; //client side used
        this.rotation = 0;
        this.canmove = true; 
        this.queuedTransmission = false;
        this.lastTransmission = Date.now();

    }

    setPos(x,y,rotation){
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    move(){
        //rotation 0-7 correspond to a requested movement of 0deg, 45deg, 90deg, etc
        const dx = Math.cos(this.rotation*45*Math.PI/180) ;
        const dy = Math.sin(this.rotation*45 * Math.PI / 180) ;
        this.x += dx * catSpeed * TICK;
        this.y -= dy * catSpeed * TICK;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        if(this.canvas){
            console.log('rotating', this.rotation * 45);
            this.canvas.getContext('2d').rotate(this.rotation * 45 * Math.PI / 180);
            this.canvas.getContext('2d').save();
        }
    }
 
    handleCollisions(){
        const top = 0;
        const bottom = 0;
        const left = 0;
        const right = 0;
    }

    // transmits the most recent movement as soon as possible
    transmit(socket){
        if(this.queuedTransmission) return;

        const now = Date.now();
        if (now-this.lastTransmission > TICK){
            console.log('sending',this.x,this.y);
            this.queuedTransmission = false;
            this.move();
            socket.emit('playermove', {rotation: this.rotation});
        }
        else{
        // queue a transmission asap
            this.queuedTransmission = true;
           
            setTimeout(() => {
                this.transmit(socket);
            }, TICK+this.lastTransmission-now+1 );
        }
      

    }

    handleRotation(newRotation) {
        if(newRotation!==this.rotation){
            this.rotation = newRotation;
            const playerctx = this.canvas.getContext('2d');
            playerctx.resetTransform();
            playerctx.clearRect(0, 0, this.canvas.height, this.canvas.width);
            playerctx.translate(this.canvas.width / 2, this.canvas.height / 2);
           
            playerctx.rotate(( (90-this.rotation*45  )* Math.PI) / 180);
            playerctx.drawImage(this.img, 2, 0, 25, 100, 0, 0, 25, 100);
        }
 
    }

    draw(ctx) { //sx, sy, sWidth, sHeight, dx, dy,
        
        ctx.drawImage(this.canvas, this.x, this.y);
    }
}

module.exports.Player = Player;