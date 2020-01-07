/*
About the simplest sketching program I can think of.
*/
let canvas, context;

function start(e){
    context.beginPath()
    context.moveTo(e.x, e.y)
    canvas.addEventListener('mousemove', draw)
}

function draw(e){
    context.lineTo(e.x, e.y)
    context.stroke()
}

function end(e){
    context.closePath()
    canvas.removeEventListener('mousemove', draw)
}

window.onload = function (){
    canvas = document.querySelector('canvas')
    context = canvas.getContext('2d')
    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mouseleave', end)
}
