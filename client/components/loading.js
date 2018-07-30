angular.module('app')
    .controller('loading', function() {

        //refactor in Angular directive
        const canvas = document.getElementById('load-page');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        let mouse = {
            x: innerWidth/2,
            y: innerHeight/2
        };

        let colorArray = [
            '#327ECE',
            '#35AFD8',
            '#39C1BF',
            '#35D8A7',
            '#32CE74'
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

        function Particle(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.radians = Math.random() * Math.PI * 2;
            this.velocity = 0.05;
            this.distanceFromCenter = Math.floor(Math.random() * (120 - 50 + 1) + 50);
            this.lastMouse = {x: this.x, y: this.y};

            this.draw = function(lastPoint) {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.radius;
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
                ctx.closePath();
            };
    
            this.update = function() {
                const lastPoint = {x: this.x, y:this.y};
                this.radians += this.velocity;
                this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
                this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
                this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
                this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
                this.draw(lastPoint);
            };
        }

        let particles= [];
        function init() {
            for (let i = 0; i < 50; i++) {
                const radius = (Math.random() * 2) + 2.5;
                particles.push(new Particle(canvas.width/2, canvas.height/2, radius, randomColor(colorArray)));
            }  
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
            });
        }

        init();

        animate();

    })
    .directive('gameLauncher', function()
    {
        return {
            restrict : "A",

            link : (scope, element, attrs, controller) =>
            {
                var ctrl = scope.$ctrl
                console.log(ctrl.loaded)
                ctrl.socket.on('initGame',() => {
                    ctrl.toggleLoaded()
                    console.log('triggered')
                    console.log(ctrl.loaded)
                    console.log(ctrl)
                })
            }
        }
    })
    .component('loading', {
        bindings : {
            socket : '=',
            toggleLoaded : '=',
            loaded : '='
        },
        controller: 'loading',
        templateUrl: '/templates/loading.html'
    });
 