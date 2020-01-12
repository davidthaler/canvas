/*
About the simplest sketching program I can think of.
*/
let canvas, context;

function shiftXY(x, y){
    return [x - canvas.offsetLeft, y - canvas.offsetTop + window.scrollY]
}

function start(e){
    e.preventDefault()
    context.beginPath()
    let [x, y] = shiftXY(e.x, e.y)
    context.moveTo(x, y)
    canvas.addEventListener('mousemove', draw)
}

function draw(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.x, e.y)
    context.lineTo(x, y)
    context.stroke()
}

function end(e){
    e.preventDefault()
    context.closePath()
    canvas.removeEventListener('mousemove', draw)
}

window.addEventListener('load', function (){
    canvas = document.querySelector('canvas')
    context = canvas.getContext('2d')
    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mouseleave', end)
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
    let println = `window.innerHeight: ${window.innerHeight}
    window.innerWidth: ${window.innerWidth}
    window.outerHeight: ${window.outerHeight}
    window.outerWidth: ${window.outerWidth}
    canvas.height: ${canvas.height}
    canvas.width: ${canvas.width}
    canvas.offsetTop: ${canvas.offsetTop}
    canvas.offsetLeft: ${canvas.offsetLeft}`
    document.getElementById('output').textContent = println
})
