angular.module('gameinstance')
.controller('opponentCatCtrl', function()
	{
		this.canvas;
		// NEEED THE FOLLOWING FOR ROTATING PLAYER CAT TO FUNCTION
		//CURRENT VECTOR

		//RELEVANT TEAM COLORED CAT
		this.img
//define prerequisites for rotation map
		this.speed = 5;
		var pos = this.speed;
		var neg = 0 - this.speed;
//define custom rotation map (needs to be specific to each cat)
				//ROTATION MAP : stupid manual degree mapping function that
				//wont render any direction that's not at a 45 degrees or 90
				//should rewrite for mittens mode
	    // this.rotation = {
	    //     [neg] : {
	    //         [neg] : 315,
	    //         0  : 270,
	    //         [pos]  : 225
	    //     },
	    //     0 : {
	    //         [neg] : 0,
	    //         0  : 0,
	    //         [pos]  : 180
	    //     },
	    //     [pos] : {
	    //         [neg] : 45,
	    //         0 : 90,
	    //         [pos] : 135
	    //     }
     //    }

	})
.directive('multiplayer', function() 
	{
		return {
			restrict : "A",
//TO DO : INSERT ANIMATION IF Math.abs(RIGHT) + Math.abs(down) > 0
			link : (scope, element) => 
			{
				console.log(scope)
//set ctrl to scope of controller
				var ctrl = scope.$ctrl
				ctrl.img = ctrl.teamoneimg

//check to see the functionality oof this in the paren anim directive
				ctrl.canvas = element[0];
//set canvas var to cbe the canvas object that the directive lives on
				var canvas = element[0];
//define 2d context on canvas
				var ctx = canvas.getContext('2d')

				function rotateOpponent(){
//call animation frame
// console.log(ctrl)
// console.log(ctrl.rotation)
					
//clear previous frame
					ctx.clearRect(0,0,canvas.height, canvas.width)
//set rotation for opponent cat
                    var spin = ctrl.rotation
// set hold state to current direciton <<<<<< NECCESSITATES SEPARATE ROTATION MAPS FOPR EACH CAT
                    // ctrl.rotation[0][0] = ctrl.rotation
//define  rotation origin as center of the canvas
                    ctx.translate(canvas.width/2, canvas.height/2)
//rotate canvas around center point
                    ctx.rotate(spin*Math.PI / 180)
//draw cat on rotated canvaS
                    ctx.drawImage(ctrl.img,0,0,25,60,-14,-20,25,60)
                    // ctx.drawImage(this.catImage,0,0,25,60,-12,-30,25,60)
//reset coordinate system for other rotations
                    ctx.rotate((0 - spin)*Math.PI / 180)
//reset rotation point
                    ctx.translate(-canvas.width/2, -canvas.height/2)
				}
//call rotation upon change in rotation in scope
			scope.$watch(function(scope)
			{
				return scope.$ctrl.rotation
			}, function()
				{
				rotateOpponent();
				})				
				

			}

		}
	})
.component('opponentcat', {
	bindings : {
		playervector : '=',
		teamoneimg : '=',
		rotation : '<',
		ident: '<'
	},
	controller: 'opponentCatCtrl',
	templateUrl: './templates/opponentcat.html'
})