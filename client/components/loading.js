angular.module('app')
    .controller('loading', function() {
        // Retrieves canvas element from html file
        const canvas = document.getElementById('load-page');
        // Sets width and height of canvas to take up entire screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // 2d motion
        const ctx = canvas.getContext('2d');
        
        // Puts starting location of circle in the middle of the page
        let mouse = {
            x: innerWidth/2,
            y: innerHeight/2
        };
        
        // All of the particles' colors
        let colorArray = [
            '#327ECE',
            '#35AFD8',
            '#39C1BF',
            '#35D8A7',
            '#32CE74'
        ];
 
        // Changes what is rendered on the page based on mouse location
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Allows user to resize their window, and the swirling circle won't go off the page
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            init();
        });

        // Randomize the color that is generated for each moving particle
        function randomColor(colors) {
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Sets all of the methods for each Particle
        function Particle(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            // Puts starting location of each particle at a random spot on a circle
            this.radians = Math.random() * Math.PI * 2;
            // Speed of moving particle 
            this.velocity = 0.05;
            // Randomizes starting location of each particle as a 
            // random distance from the center between 50 and 120
            this.distanceFromCenter = Math.floor(Math.random() * (120 - 50 + 1) + 50);
            // Keeps track of mouse's last position
            // Used for drag effect 
            this.lastMouse = {x: this.x, y: this.y};
            
            this.update = function() {
                // Records particle's last point before anything is updated 
                const lastPoint = {x: this.x, y:this.y};
                this.radians += this.velocity;
                // Calculate distance between last mouse and current mouse position
                // Object is only moved by 5% to create the drag effect
                // Delete 0.05 from the following two equations, and you will see what I mean
                this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
                this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
                // Creates circular motion of the particles
                this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
                this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
                this.draw(lastPoint);
            };

            this.draw = function(lastPoint) {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.radius;
                // moveTo accepts coordinates from particle's previous frame
                ctx.moveTo(lastPoint.x, lastPoint.y);
                // lineTo accepts coordinate for particles new frame
                // A line is drawn between moveTo and lineTo coordinates 
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
                ctx.closePath();
            };
    
        }

        let particles;
        function init() {
            particles = [];
            for (let i = 0; i < 75; i++) {
                // Randomizes radius of each particle between 1 and 2
                const radius = (Math.random() * 2) + 1;
                particles.push(new Particle(canvas.width/2, canvas.height/2, radius, randomColor(colorArray)));
            }  
        }

        function animate() {
            requestAnimationFrame(animate);
            // Rectangle is drawn on top of circles each time animate loop is run
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
            });
        }

        init();

        animate();

    })
    .component('loading', {
        bindings : {

        },
        controller: 'loading',
        templateUrl: '/templates/loading.html'
    });
 