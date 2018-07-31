const { TICK, catSpeed} = require('./gamelogic');

class Player {
    constructor(team,id){
        this.team = team;
        this.id = id;
        this.x = 200;
        this.y = 200;
        this.rotation = 0;
        this.updated = false; //server side used
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
        this.currentX += dx * catSpeed;
        this.currentY += dy * catSpeed;
        this.currentX = Math.floor(this.currentX);
        this.currentY = Math.floor(this.currentY);

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
            this.queuedTransmission = false;
            socket.emit('playermove', pack(this.rotation));
        }
        else{
        // queue a transmission asap
            this.queuedTransmission = true;

            setTimeout(() => {
                this.transmit(socket);
            }, TICK+this.lastTransmission-now+1 );
        }
      

    }
}

module.exports.Player = Player;