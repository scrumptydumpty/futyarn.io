const { TICK, SPEED, WIDTH, HEIGHT } = require('./gamelogic');

class Player {
    constructor(team, id, user_id, username, x,y=200,rotation){
        this.team = team;
        this.id = id;
        if (x === undefined) {
            x = team==='orange' ? 200 : 600; // team orange on the left, team black on the right
        }
        this.x = x;
        this.y = y; 
        this.canvas = null; // client side used
        this.img = null; //client side used
        if(username.length>10){
            username = username.slice(0,10);
        }
        this.username = username;
        this.user_id = user_id;

        if(rotation === undefined){
            rotation = team === 'orange' ? 0 : 180; // team orange on the left, team black on the right
        }
        this.rotation = rotation; //degrees
        this.kicking = false;
        this.canmove = false; // used on server to prevent spam. locked down every TICK
        this.animationFrame = 0;
        this.queuedTransmission = false;
        this.goals = 0;
        this.lastTransmission = Date.now();

    }

    setPos(x,y,rotation){
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    generateCanvas(img){
        this.img = img;
        var playercanvas = document.createElement('CANVAS');
        playercanvas.id = this.id;
        playercanvas.height = 100;
        playercanvas.width = 100;
        // rotate 45 degrees clockwise
        this.canvas = playercanvas;
    }

    move(){
        //rotation  correspond to a requested movement of 0deg, 45deg, 90deg, etc
        const dx = Math.cos(this.rotation * Math.PI / 180) ;
        const dy = Math.sin(this.rotation * Math.PI / 180) ;
      
        this.x += dx * SPEED * TICK;
        this.y -= dy * SPEED * TICK;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        
    }
 
    handleCollisions(){

        // left
        if (this.x < -20){
            this.x =-20;
        }
        // right
        if(this.x > (WIDTH - 80)) {
            this.x = WIDTH-80;
        }
        // top
        if (this.y < -20){
            this.y = -20;
        }
        // bottom
        if(this.y > (HEIGHT - 80)) {
            this.y = HEIGHT-80;
        }

        this.kicking = false;
    }

    // transmits the most recent movement as soon as possible
    transmit(socket){
        if(this.queuedTransmission) return;

        const now = Date.now();
        if (now-this.lastTransmission > TICK){
            this.queuedTransmission = false;
            this.move();
            socket.emit('playermove', {rotation: this.rotation, kicking:this.kicking});
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
        }
 
    }

    draw(ctx) { //sx, sy, sWidth, sHeight, dx, dy,
        this.animationFrame++;
        if (this.animationFrame > 16) {
            this.animationFrame = 0;
        }

        const playerctx = this.canvas.getContext('2d');
        playerctx.resetTransform();
        playerctx.clearRect(0, 0, this.canvas.height, this.canvas.width);
        //playerctx.fillStyle = 'red';
        //playerctx.fillRect(0,0,this.canvas.height,this.canvas.width);
        playerctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        playerctx.rotate(((90 - this.rotation) * Math.PI) / 180);
        playerctx.drawImage(this.img, 2+(this.animationFrame*29), 0, 25, 60, -14, -20, 25, 60);
        ctx.drawImage(this.canvas, this.x, this.y);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(this.username,this.x+50,this.y+25);
    }
}

module.exports.Player = Player;