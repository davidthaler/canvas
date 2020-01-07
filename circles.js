/*
First step towards GraphMaker on canvas: adding nodes/circles.
*/
window.onload = function(){
    const RADIUS = 10

    function drawCircle(e){
        ctx.moveTo(e.x + RADIUS, e.y)
        ctx.arc(e.x, e.y, RADIUS, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }

    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'gray'
    ctx.fillStyle = 'lightgray'
    canvas.addEventListener('click', drawCircle)
}