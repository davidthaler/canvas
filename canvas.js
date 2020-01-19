/*
A simple sketching program that lets you load a background image from 
your file system to doodle on. Can also select line color and width.
Has basic undo functionality.
*/
let canvas, context, img;
let datalog = [];

function shiftXY(x, y){
    return [x - canvas.offsetLeft, y - canvas.offsetTop + window.scrollY]
}

function addPoint(x, y){
    let path = datalog[datalog.length - 1]
    path.points.x.push(x)
    path.points.y.push(y)
}

function start(e){
    context.beginPath()
    let [x, y] = shiftXY(e.x, e.y)
    context.moveTo(x, y)
    canvas.addEventListener('mousemove', draw)
    datalog.push({'color':context.strokeStyle, 
                    'lineWidth':context.lineWidth, 
                    'points':{'x':[x], 'y':[y]}})
}

function draw(e){
    let [x, y] = shiftXY(e.x, e.y)
    context.lineTo(x, y)
    context.stroke()
    addPoint(x, y)
}

function end(e){
    context.closePath()
    canvas.removeEventListener('mousemove', draw)
}

function redraw(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    if(img){
        context.drawImage(img, 0, 0)
    }
    for(let path of datalog){
        context.strokeStyle = path.color
        context.lineWidth = path.lineWidth
        let x = path.points.x
        let y = path.points.y
        context.beginPath()
        context.moveTo(x[0], y[0])
        for(let i=1; i < x.length; i++){
            context.lineTo(x[i], y[i])
        }
        context.stroke()
    }
}

function reset(){
    img = undefined
    datalog = []
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function keydown(e){
    if(e.key != 'Backspace') return
    datalog.pop()
    redraw()
    window.addEventListener('keyup', keyup)
    window.removeEventListener('keydown', keydown)
}

function keyup(e){
    window.addEventListener('keydown', keydown)
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
    canvas.height = Math.min(window.innerHeight, canvas.height)
    canvas.width = Math.min(window.innerWidth, canvas.width)

    window.addEventListener('keydown', keydown)

    let imagePicker = document.getElementById('imagePicker')
    document.getElementById('chooseImage')
            .addEventListener('click', function(){
                imagePicker.click()
            })

    imagePicker.addEventListener('change', function(){
        if(this.files.length == 0){
            console.log('File picker closed with no files selected')
            return
        }
        let f = this.files[0]
        if(f.type.startsWith('image')){
            img = document.createElement('img')
            let reader = new FileReader()
            reader.addEventListener('load', function(){
                img.src = reader.result
                img.addEventListener('load', function(){
                    canvas.height = img.height
                    canvas.width = img.width
                    context.drawImage(img, 0, 0)
                })
            })
            reader.readAsDataURL(f)
        }else{
            console.error(`Cannot load as image:${f.name} type:${f.type}`)
        }
    })
})
