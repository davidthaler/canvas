/*
About the simplest sketching program you can imagine...
*/
window.onload = main;

let canvas, ctx, penDown;

function start(e){
    ctx.beginPath()
    ctx.moveTo(e.x, e.y)
    penDown = true
}

function draw(e){
    if(penDown){
        ctx.lineTo(e.x, e.y)
        ctx.stroke()
    }
}

function end(e){
    ctx.closePath()
    penDown = false
}

function main(){
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')
    penDown = false;
    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', end)
}