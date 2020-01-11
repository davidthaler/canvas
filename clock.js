/*
A basic old-fashioned clock, with hands.
*/
window.addEventListener('load', main)

let canvas, context, R

function createSecondHand(head, tail, width, color){
    let range60 = arcRange(60)
    return function(seconds){
        drawHand(head, tail, width, range60[seconds], color)
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

// for now, we draw one tick at 12 o'clock
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

function arcRange(n){
    let a = []
    for(let i=0; i < n; i++){
        a.push(i)
    }
    a = a.map(x => 2 * Math.PI * x / n)
    return a
}

function drawTicks(){
    arcRange(12).forEach(x => drawTick(0.9, x, 0.1, 2))
    arcRange(60).forEach(x => drawTick(0.9, x, 0.05, 1))
}

function main(){
    let iW = window.innerWidth
    let iH = window.innerHeight
    canvas = document.querySelector('#main > canvas')
    context = canvas.getContext('2d')
    canvas.width = iW
    canvas.height = iH
    let cx = iW / 2
    let cy = iH / 2
    let D = Math.min(iW, iH)
    R = D / 2
    context.translate(cx, cy)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `${0.1*R | 0}px sans-serif`
    drawCenter(0.01)
    drawTicks()
    drawNumbers(0.7)
}
