/*
About the simplest sketching program I can think of.
*/
let canvas, context;

function getXY(e){
    let x, y
    if(e instanceof TouchEvent){
        let touch = e.changedTouches[0]
        [x, y] = [touch.clientX, touch.clientY]
    }else{
        [x, y] = [e.clientX, e.clientY]
    }
    return [x - canvas.offsetLeft, y - canvas.offsetTop + window.scrollY]
}

function start(e){
    e.preventDefault()
    context.beginPath()
    let [x, y] = getXY(e)
    context.moveTo(x, y)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('touchmove', draw)
}

function draw(e){
    e.preventDefault()
    let [x, y] = getXY(e)
    context.lineTo(x, y)
    context.stroke()
}

function end(e){
    e.preventDefault()
    context.closePath()
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener('touchmove', draw)
}

window.addEventListener('load', function (){
    canvas = document.querySelector('canvas')
    context = canvas.getContext('2d')
    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mouseleave', end)
    canvas.addEventListener('touchstart', start)
    canvas.addEventListener('touchend', end)
    canvas.addEventListener('touchcancel', end)
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
