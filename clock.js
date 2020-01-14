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
assume anything about those values. If you use them, set them to the values that you need.

Branch clockSpec.
We have to get all of the magic numbers out of here.
They will be incomprehensible to anyone else, or to me later.

I'm going to put them into a clockSpec object with all of the program data.
Then we can comment that, and use descriptive names
*/
let canvas, context, R
let secondHand, minuteHand, hourHand

const clockSpec = {
    secondHand:{
        display: true,
        length: 0.5,
        overhang: 0.1,
        lineWidth: 0.5,
        color: 'red'
    },
    minuteHand:{
        display: true,
        length: 0.6,
        overhang: 0.15,
        lineWidth: 2,
        color:'black'
    },
    hourHand:{
        display: true,
        length: 0.4,
        overhang: 0.1,
        lineWidth: 4,
        color:'black'
    },
    majorTick:{
        display:true,
        outerRadius: 0.9,
        length: 0.1,
        lineWidth: 2,
        color: 'black'
    },
    minorTick:{
        display:true,
        outerRadius: 0.9,
        length: 0.05,
        lineWidth: 1,
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

function drawNumber(num, theta, r){
    context.save()
    context.rotate(theta)
    context.translate(0,  - r * R)
    context.rotate(-theta)
    context.fillText(num, 0, 0)
    context.restore()
}

function drawNumbers(r){
    const numbers = [12,1,2,3,4,5,6,7,8,9,10,11]
    arcRange(12).forEach((theta, i) => drawNumber(numbers[i], theta, r))
}

function drawCenter(r){
    context.beginPath()
    context.arc(0, 0, r * R, 0, 2 * Math.PI)
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
    arcRange(12).forEach(angle => drawTick(angle, clockSpec.majorTick))
    arcRange(60).forEach(angle => drawTick(angle, clockSpec.minorTick))
}

function arcRange(n){
    let a = Array(n).fill(0).map((_, i) => i)
    return a.map(x => 2 * Math.PI * x / n)
}

function clearCanvas(){
    context.clearRect(-R, -R, 2*R, 2*R)
}

function drawClock(){
    clearCanvas()
    drawTicks()
    drawNumbers(0.7)
    let now = new Date()
    secondHand(now.getSeconds())
    minuteHand(now.getMinutes(), now.getSeconds())
    hourHand(now.getHours(), now.getMinutes())
    drawCenter(0.01)
}

function makeClock(){
    let iW = window.innerWidth
    let iH = window.innerHeight
    canvas.width = iW
    canvas.height = iH
    let cx = iW / 2
    let cy = iH / 2
    let D = Math.min(iW, iH)
    R = D / 2
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `${0.1*R | 0}px sans-serif`
    context.translate(cx, cy)
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
