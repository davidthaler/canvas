/*
A basic old-fashioned clock, with hands.
*/
let canvas, context, R
let secondHand, minuteHand, hourHand

function createHourHand(head, tail, width, color){
    return function(hours, minutes){
        let angle = 2*Math.PI * (60*(hours % 12) + minutes) / 720
        drawHand(head, tail, width, angle, color)
    }
}

function createMinuteHand(head, tail, width, color){
    return function(minutes, seconds){
        let angle = 2*Math.PI * (60*minutes + seconds) / 3600
        drawHand(head, tail, width, angle, color)
    }
}

function createSecondHand(head, tail, width, color){
    return function(seconds){
        let angle = 2*Math.PI * seconds / 60
        drawHand(head, tail, width, angle, color)
    }
}

function drawHand(head, tail, width, angle, color){
    context.save()
    let prevLW = context.lineWidth
    let prevColor = context.strokeStyle
    context.strokeStyle = color
    context.beginPath()
    context.lineWidth = width
    context.rotate(angle)
    context.moveTo(0, head * R)
    context.lineTo(0, -tail * R)
    context.stroke()
    context.strokeStyle = prevColor
    context.lineWidth = prevLW
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

function drawTick(r, theta, l, w){
    context.save()
    let oldW = context.lineWidth
    context.lineWidth = w
    context.rotate(-theta)
    context.beginPath()
    context.moveTo(0, R * (r-l))
    context.lineTo(0, R * r)
    context.stroke()
    context.lineWidth = oldW
    context.restore()
}

function drawTicks(){
    arcRange(12).forEach(x => drawTick(0.9, x, 0.1, 2))
    arcRange(60).forEach(x => drawTick(0.9, x, 0.05, 1))
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
    secondHand = createSecondHand(0.1, 0.5, 0.5, 'red')
    minuteHand = createMinuteHand(0.15, 0.6, 2, 'black')
    hourHand = createHourHand(0.1, 0.4, 4, 'black')
    setInterval(drawClock, 1000)
    drawClock()
}
 
 window.addEventListener('load', function(){
    canvas = document.querySelector('#main > canvas')
    context = canvas.getContext('2d')
    window.addEventListener('resize', makeClock)
    makeClock()
})
