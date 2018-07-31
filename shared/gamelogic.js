
module.exports = {
    catSpeed : 10, // how many pixels per tick the cat can move
    TICK : 200, // ms per server tick
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
    cache: {
        score: {
            1: 0,
            2: 0
        },
        ball : null,
        players:{},
        totalPlayers: 0,
        shouldStart: false,
        gameRunning: true
    }

};