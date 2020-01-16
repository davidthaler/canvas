/*
Clock. A simple old-fashioned clock with hands.

The details...not so simple or old-fashioned.

1. Relative dimensioning. To get the clock to display at a variety of sizes,
we center it on the screen, and then define a length scale, R, which is half 
of the smaller side length. Most dimensions on the clock are ratios of R, and 
are in [0, 1].

2. Origin transformation. When the clock is first made, the origin of the canvas
coordinates is shifted to the display center point, with +y pointing straight down.

3. Save/restore. Every function starts with the origin at the screen center. 
Every function should return with the origin back at the center. So save() before 
doing any transforms and restore() after.

4. Stomping on strokeStyle, fillStyle and lineWidth is ok. Subsequent code shouldn't 
assume anything about those, it should set them to the values needed.
*/
let canvas, context, R
let secondHand, minuteHand, hourHand

const clockSpec = {
    secondHand:{
        display: true,
        length: 0.5,            // dist from clock pivot to tip
        overhang: 0.1,          // dist from pivot to other end
        lineWidth: 0.5,
        color: 'red'
    },
    minuteHand:{
        display: true,
        length: 0.7,
        overhang: 0.175,
        lineWidth: 2,
        color:'black'
    },
    hourHand:{
        display: true,
        length: 0.5,
        overhang: 0.125,
        lineWidth: 4,
        color:'black'
    },
    majorTick:{
        display: true,
        outerRadius: 0.9,
        length: 0.075,
        lineWidth: 1,
        color: 'black'
    },
    minorTick:{
        display: true,
        outerRadius: 0.9,
        length: 0.05,
        lineWidth: 1,
        color: 'gray'
    },
    center:{
        display: true,
        radius: 0.025,
        color: 'black'
    },
    numbers:{
        display: true,
        numbers: [12,1,2,3,4,5,6,7,8,9,10,11],
        centerRadius: 0.7,
        font: 'avenir, sans-serif',
        fontSize: 0.1,
        color: 'black'
    },
    fullBackground:{
        display: false,
        color: 'white'
    },
    squareBackground:{
        display: true,
        color: 'white'
    },
    bezel:{
        display: true,
        innerRadius: 0.9,
        width: 0.05,
        color: 'black'
    }
}

function createHourHand(){
    return function(hours, minutes){
        let angle = 2*Math.PI * (60*(hours % 12) + minutes) / 720
        drawHand(angle, clockSpec.hourHand)
    }
}

function createMinuteHand(){
    return function(minutes, seconds){
        let angle = 2*Math.PI * (60*minutes + seconds) / 3600
        drawHand(angle, clockSpec.minuteHand)
    }
}

function createSecondHand(){
    return function(seconds){
        let angle = 2*Math.PI * seconds / 60
        drawHand(angle, clockSpec.secondHand)
    }
}

function drawHand(angle, handSpec){
    if(!handSpec.display) return
    context.save()
    context.strokeStyle = handSpec.color
    context.lineWidth = handSpec.lineWidth
    context.beginPath()
    context.rotate(angle)
    context.moveTo(0, handSpec.overhang * R)
    context.lineTo(0, -handSpec.length * R)
    context.stroke()
    context.restore()
}

function drawNumber(num, theta){
    context.save()
    context.rotate(theta)
    context.translate(0,  -clockSpec.numbers.centerRadius * R)
    context.rotate(-theta)
    context.fillText(num, 0, 0)
    context.restore()
}

function drawNumbers(){
    if(!clockSpec.numbers.display) return
    let nums = clockSpec.numbers.numbers
    context.fillStyle = clockSpec.numbers.color
    context.font = `${clockSpec.numbers.fontSize * R | 0}px ${clockSpec.numbers.font}`
    arcRange(nums.length).forEach((theta, i) => drawNumber(nums[i], theta))
}

function drawCenter(){
    if(!clockSpec.center.display) return
    context.beginPath()
    context.fillStyle = clockSpec.center.color
    context.arc(0, 0, clockSpec.center.radius * R, 0, 2 * Math.PI)
    context.fill()
}

function drawTick(angle, tickSpec){
    if(!tickSpec.display) return
    context.save()
    context.lineWidth = tickSpec.lineWidth
    context.strokeStyle = tickSpec.color
    context.rotate(-angle)
    context.beginPath()
    context.moveTo(0, R * (tickSpec.outerRadius - tickSpec.length))
    context.lineTo(0, R * tickSpec.outerRadius)
    context.stroke()
    context.restore()
}

function drawTicks(){
    arcRange(60).forEach(angle => drawTick(angle, clockSpec.minorTick))
    arcRange(12).forEach(angle => drawTick(angle, clockSpec.majorTick))
}

function drawBezel(){
    if(!clockSpec.bezel.display) return
    context.fillStyle = clockSpec.bezel.color
    context.beginPath()
    context.moveTo(clockSpec.bezel.innerRadius * R, 0)
    context.arc(0, 0, clockSpec.bezel.innerRadius * R, 0, 2 * Math.PI)
    // Have to change either the arc direction or the fill rule.
    context.arc(0, 0, (clockSpec.bezel.innerRadius + clockSpec.bezel.width) * R,
                0, 2 * Math.PI, true)
    context.fill()
}

function drawSquareBackground(){
    if(!clockSpec.squareBackground.display) return
    context.fillStyle = clockSpec.squareBackground.color
    context.fillRect(-R, -R, 2*R, 2*R)
}

function drawFullBackground(){
    if(!clockSpec.fullBackground.display) return
    let geom = doGeometry()
    context.fillStyle = clockSpec.fullBackground.color
    context.fillRect(-geom.cx, -geom.cy, geom.iW, geom.iH)
}

function arcRange(n){
    let a = Array(n).fill(0).map((_, i) => i)
    return a.map(x => 2 * Math.PI * x / n)
}

function clearCanvas(){
    let geom = doGeometry()
    context.clearRect(-geom.cx, -geom.cy, geom.iW, geom.iH)
}

function drawClock(){
    clearCanvas()
    drawFullBackground()
    drawSquareBackground()
    drawTicks()
    drawBezel()
    drawNumbers()
    let now = new Date()
    secondHand(now.getSeconds())
    minuteHand(now.getMinutes(), now.getSeconds())
    hourHand(now.getHours(), now.getMinutes())
    drawCenter()
}

function doGeometry(){
    let iW = window.innerWidth
    let iH = window.innerHeight
    let cx = iW / 2
    let cy = iH / 2
    let diam = Math.min(iW, iH)
    radius = diam / 2
    return {radius, cx, cy, iW, iH}
}

function makeClock(){
    let geom = doGeometry()
    R = geom.radius
    canvas.width = geom.iW
    canvas.height = geom.iH
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.translate(geom.cx, geom.cy)
    secondHand = createSecondHand()
    minuteHand = createMinuteHand()
    hourHand = createHourHand()
    setInterval(drawClock, 1000)
    drawClock()
}
 
 window.addEventListener('load', function(){
    canvas = document.querySelector('#main > canvas')
    context = canvas.getContext('2d')
    window.addEventListener('resize', makeClock)
    makeClock()
})
