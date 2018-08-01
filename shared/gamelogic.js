
module.exports = {
    catSpeed : .2, // how many pixels per ms the cat can move
    TICK : 30, // ms per server tick
    WIDTH: 1200, // game canvas width
    HEIGHT: 650, // game canvas height
    // distance modifier to the head, based on the rotation of the cat
    hitBoxMap: {
        0: [50, 45],
        1: [56, 48],
        2: [60, 55],
        3: [56, 58],
        4: [50, 62],
        5: [44, 58],
        6: [40, 55],
        7: [44, 48],
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