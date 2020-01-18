/*
A simple sketching program that lets you load a background image from 
your file systemto doodle on. Can also select line color and width.
*/
let canvas, context;

function shiftXY(x, y){
    return [x - canvas.offsetLeft, y - canvas.offsetTop + window.scrollY]
}

function start(e){
    context.beginPath()
    let [x, y] = shiftXY(e.x, e.y)
    context.moveTo(x, y)
    canvas.addEventListener('mousemove', draw)
}

function draw(e){
    let [x, y] = shiftXY(e.x, e.y)
    context.lineTo(x, y)
    context.stroke()
}

function end(e){
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
    canvas.height = Math.min(window.innerHeight, canvas.height)
    canvas.width = Math.min(window.innerWidth, canvas.width)

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
            let img = document.createElement('img')
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
