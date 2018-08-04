
module.exports = {
    SPEED : .2, // how many pixels per ms objects should move
    TICK : 30, // ms per server tick
    WIDTH: 1200, // game canvas width
    HEIGHT: 650, // game canvas height
    // distance modifier to the head, based on the rotation of the cat
    hitBoxMap: {
        0: [50, 45],
        45: [56, 48],
        90: [60, 55],
        135: [56, 58],
        180: [50, 62],
        225: [44, 58],
        270: [40, 55],
        315: [44, 48],
    },

    status:{
        waitingForPlayers:0,
        active:1,
        gameWon:2,
        abandoned:3
    },
    TEAM:{
        orange:0,
        black:1
    }
    

};