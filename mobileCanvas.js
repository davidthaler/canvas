/*
A very basic drawing-on-mobile
*/
let canvas, context, time
const MINMILLIS = 20

function shiftXY(e){
    return [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]
}

function start(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.beginPath()
    context.moveTo(x, y)
    time = Date.now()
    console.log('start')
}

function draw(e){
    e.preventDefault()
    let timeDiff = Date.now() - time 
    if(timeDiff > MINMILLIS){
        let [x, y] = shiftXY(e.touches[0])
        context.lineTo(x, y)
        context.stroke()
        time += timeDiff
        console.log(`to(${x},${y}) @${time}`)
    }
}

window.addEventListener('load', function(){
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    canvas.addEventListener('touchstart', start, false)
    canvas.addEventListener('touchmove', draw, false)
    document.getElementById('picker')
    .addEventListener('change', function(){
        context.strokeStyle = this.value
    })
    let wd = document.getElementById('widthDisplay')
    document.getElementById('widthSelector')
            .addEventListener('change', function(){
                context.lineWidth = this.value ** 2
                wd.textContent = this.value
            })
})
