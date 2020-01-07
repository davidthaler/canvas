/*
First step towards GraphMaker on canvas: adding nodes/circles.
*/
window.onload = main

const RADIUS = 10
let canvas, ctx, btnState
let nodes = []

let stateColor = {
    'normal'   : {'fill': 'lightgray', 'stroke': 'darkgray'},
    'selected' : {'fill': 'whitesmoke', 'stroke': 'gray'}
}

function drawCircle(c){
    ctx.beginPath()
    ctx.moveTo(c.x + RADIUS, c.y)
    ctx.arc(c.x, c.y, RADIUS, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawNodes(){
    clearCanvas()
    nodes.forEach(drawCircle)
}

//Returns index in nodes of first node within distance d of point x, y
function withinDist(x, y, d){
    return nodes.findIndex(n => ((n.x - x)**2 + (n.y - y)**2) <= d**2)
}

function removeNode(e){
    if(btnState == 'removeNode'){
        let nIdx = withinDist(e.x, e.y, RADIUS)
        if(nIdx != -1){
            console.log(`found node: ${nIdx}`)
            nodes.splice(nIdx, 1)
            drawNodes()
        }   
    }
}

function addNode(e){
    if(btnState == 'addNode'){
        if(withinDist(e.x, e.y, 2 * RADIUS) == -1){
            nodes.push({x:e.x, y:e.y})
            drawNodes()
        }
    }
}

function main(){
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'gray'
    ctx.fillStyle = 'lightgray'
    canvas.addEventListener('click', removeNode)
    canvas.addEventListener('click', addNode)
    document.querySelectorAll('input').forEach(b => 
        b.addEventListener('change', function(){
                btnState=this.value
            }))
}
