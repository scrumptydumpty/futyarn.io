const canvas = document.getElementById('load-page');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// ctx.fillStyle = 'rgba(255, 0, 0, 0.5';
// ctx.fillRect(100, 100, 100, 100);
// ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; 
// ctx.fillRect(400, 100, 100, 100);
// ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; 
// ctx.fillRect(300, 300, 100, 100);

// Line

// ctx.beginPath();
// ctx.moveTo(50, 300);
// ctx.lineTo(300, 100);
// ctx.lineTo(400, 300);
// ctx.strokeStyle = '#fa34a3';
// ctx.stroke();

// Arc / Circle


// Creates loop that keeps animating

let mouse = {
    // x: undefined,
    // y: undefined
    x: innerWidth/2,
    y: innerHeight/2
};

// let maxRadius = 40;
// let minRadius = 2 ;

let colorArray = [
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100'
];


window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function Particle(x, y, /*dx, dy,*/ radius, color) {
    this.x = x;
    this.y = y;
    // this.dx = dx;
    // this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distanceFromCenter = Math.floor(Math.random() * (120 - 50 + 1) + 50);
    this.lastMouse = {x: this.x, y: this.y};
    // this.minRadius = radius;
    // this.color = colorArray[Math.floor(Math.random() * colorArray.length)];



    this.draw = function(lastPoint) {
        ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // // ctx.strokeStyle = 'blue';
        // ctx.fillStyle = this.color;
        // ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    };
    
    this.update = function() {
        // if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        //     this.dx = -this.dx;
        // }
        
        // if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
        //     this.dy = -this.dy;
        // }
        // this.x += this.dx;
        // this.y += this.dy;

        // if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
        //     if (this.radius < maxRadius) {
        //         this.radius += 1;
        //     }
        // } else if (this.radius > this.minRadius ) {
        //     this.radius -= 1;
        // }

        const lastPoint = {x: this.x, y:this.y}
        this.radians += this.velocity;
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
        this.draw(lastPoint);
    };
}

// let circle = new Circle(200, 200, 3, 3, 30);
// let circleArray = [];
let particles;
function init() {

    // circleArray = [];
    particles = [];
    for (let i = 0; i < 50; i++) {
        const radius = (Math.random() * 2) + 2;
        particles.push(new Particle(canvas.width/2, canvas.height/2, radius, randomColor(colorArray)));
        // let radius = Math.random() * 3 + 1;
        // let x = Math.random() * (innerWidth - radius * 2) + radius;
        // let y = Math.random() * (innerHeight - radius * 2) + radius;
        // let dx = (Math.random() - 0.5); // ensures value is either negative or positive
        // let dy = (Math.random() - 0.5);
        // circleArray.push(new Circle(x, y, dx, dy, radius));
    }  
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)

    // for (let i = 0; i < circleArray.length; i++) {
    //     circleArray[i].update();
    // }
    
    // circle.update();
    // ctx.beginPath();
    // ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    // ctx.strokeStyle = 'blue';
    // ctx.stroke();

    // console.log('a;lskdfjalk;dsjf /'); 


    particles.forEach(particle => {
        particle.update();
    });
}

init();

animate();

 















// function draw() {
//     const canvas = document.getElementById('load-page');
//     if (canvas.getContext) {
//         const ctx = canvas.getContext('2d');

//         var offset = 0;

//         function draw() {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.setLineDash([4, 2]);
//           ctx.lineDashOffset = -offset;
//           ctx.strokeRect(10, 10, 100, 100);
//         }
        
//         function march() {
//           offset++;
//           if (offset > 16) {
//             offset = 0;
//           }
//           draw();
//           setTimeout(march, 20);
//         }
        
//         march(); 
//     }
// }