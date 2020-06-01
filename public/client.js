var socket = io.connect('https://snakemult-io.herokuapp.com/');

//https://snakemult-io.herokuapp.com/
var corusuario = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
var localP = { name: undefined, id: undefined, ingame: false, color: corusuario }

socket.on('connect', function () {
    var nick = ''
    while(nick == ''){
        nick = window.prompt('Insira seu nick')
        if(nick == undefined){
            nick = ''
        }
        if(nick.length > 12){
            nick = ''
            window.alert('Seu nick deve ter menos de 12 caracteres')
        }
    }
    localP = { name: nick, id: socket.io.engine.id, ingame: false, color:corusuario }
    socket.emit('newjoiner',localP);
});

///////CCCCCCC/////AAAAAAA////////NN/////NN/////VV/////////VVVV///////AAA////////SSSSSSSS////////
///////CC//////////A/////AA///////NN/NN//NN//////VVV/////VVV////////AA//AAA///////SS/////////////
///////CC/////////AAAA////AAA ////NN//NNNNN///////VVVV//VVVVV//////AA/////AAA/////SSSSSSS////////
///////CC/////////AAAAAAAAAAA/////NN////NN///////////VVVVV////////AAAAAAAAAAAA/////////SS///////
///////CCCCCCC///AAAA//////AAA////NN////NN///////////VVVV////////AAA/////////AAA/SSSSSSSS///////

const canvas = document.querySelector('canvas')

canvas.width  = window.innerWidth  -20
canvas.height = window.innerHeight -20
//canvas.style.background = '#E1F6FF' 
const c  = canvas.getContext('2d')                  

const standart = '#E1F6FF';
c.textBaseline = 'middle'
c.textAlign = 'center'
const cH = canvas.height
const cW = canvas.width
const cM = cW>cH?cH:cW

var maxgrid = 30
var grid = { x1: cW / 2 - cM * 0.4, y1: cH / 2 - cM * 0.4, x2: cW / 2 + cM * 0.4, y2: cH / 2 + cM * 0.4, unit: cM * 0.8 / maxgrid, mg: maxgrid, t: cM * 0.8 }
const tl = grid.unit
document.addEventListener('mousemove',  onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
var posY = null;
var posX = null;
function onMouseUpdate(e){
    posX = e.pageX;
    posY = e.pageY;
}


var audio = new Audio()
audio.pause()
canvas.onmousedown = function(event){ 
    if (onhover(posX, posY, tl, tl, tl * 10, 2 * tl + tl * players.length)){
        corusuario = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
        socket.emit('playersupdatecolor', {ind: ind,color:corusuario});
        //TROCA COR      
        
    }
    if (onhover(posX, posY, grid.x1, grid.y1, grid.t, grid.t) && players[ind].ingame == false){
        socket.emit('playerjogar',ind)
    }
    if (onhover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl) && players[ind].ingame == true ){
        socket.emit('playersair', players[ind].id)
    }
    if (onhover(posX, posY, cW - 1.45 * tl, cH - 1.5 * tl, tl, tl)){
        efectON++
    }
    if (onhover(posX, posY, cW - 2.55 * tl, cH - 1.5 * tl, tl, tl)){
        musicON++
        if (audio) {
            audio.pause()
        }
        audio = new Audio(`musica${((musicON) % 2) + 1}.mp3`);
        audio.volume = volSong
        audio.play();
        if (musicON % 3 == 0) {
            audio.pause()
        }
    }



}

/*
canvas.onmousemove = function(event){

}
canvas.onmouseup = function(event){

}
*/
var esp = 1
var fps = 90
var macatime = 20
var volEfect = 0.2
var volSong  = 0.1


const UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37, P = 80, C = 67, A = 65, S = 83; 
window.addEventListener('keydown', kd)                                         
function kd(e) {
    var key = e.keyCode
    if(key === UP){
        socket.emit('stateUpdate', { indINPLAY: indINPLAY, ori: 'T' })   
    }
    else if (key === DOWN) {
        socket.emit('stateUpdate', { indINPLAY: indINPLAY, ori: 'B' })     
    }
    if (key === RIGHT) {
        socket.emit('stateUpdate', { indINPLAY: indINPLAY, ori: 'R' })    
    }
    else if (key === LEFT) {
        socket.emit('stateUpdate', { indINPLAY: indINPLAY, ori: 'L' })         
    }
    if (key === 107) {
        if (volEfect + 0.05 < 1) {
            volEfect += 0.05
        }
    }
    if (key === 187) {
        if (volSong + 0.05 < 1) {
            volSong += 0.05
            audio.volume = volSong
        }
    }
    if (key === 109) {
        if (volEfect - 0.05 > 0) {
            volEfect -= 0.05
        }
    }
    if (key === 189) {
        if (volSong - 0.05 > 0) {
            volSong -= 0.05
            audio.volume = volSong
        }
    }
}
var macas = []
var musicON = 0
var efectON = 1
var players = []
var inplay = []
var ind = 0
var indINPLAY = 0
var audio = new Audio()
audio.pause()

socket.on('playersupdate',(d)=>{
    players = d
    for (let i in players) {
        if (players[i].id == localP.id) {
            ind = i
        }
    }
})
socket.on('inplayupdate',(d)=>{
    inplay = d
    for (let i in inplay) {
        if (inplay[i].id == localP.id) {
            indINPLAY = i
        }
    }
})
socket.on('macasupdate', (d) => {
    macas = d
})
socket.on('redcaptured', (id) => {
    if (id == localP.id && efectON % 2 == 1) {
        let rand = 2 + ~~(Math.random() * 8)
        var audi = new Audio('blop' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()
    }
})
socket.on('orangecaptured', (id) => {
    if (id == localP.id && efectON % 2 == 1) {
        let rand = Math.random()
        var stri = 'blop1.mp3'
        if (rand < 0.3) {
            stri = 'orange.mp3'
        } else if (rand < 0.6) {
            stri = 'nunao.mp3'
        }
        var audi = new Audio(stri)
        audi.volume = volEfect
        audi.play()

    }
})
socket.on('purplecaptured', (id) => {
    if (id != localP.id && efectON % 2 == 1) {
        let rand = 1 + ~~(Math.random() * 5)
        var audi = new Audio('resmungo' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()
    } else if (efectON % 2 == 1) {
        let rand = 1 + ~~(Math.random() * 5)
        var audi = new Audio('come' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()
    }
})
socket.on('agressao', (id) => {
    if (id == localP.id && efectON % 2 == 1) {
        let rand = 1 + ~~(Math.random() * 5)
        var audi = new Audio('agressao' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()        
    }
})
function drawrect(obj){
    c.fillRect(grid.x1 + obj.ix * grid.unit, grid.y1 + obj.iy * grid.unit, obj.t, obj.t)
}
con = 0
function fpsset(val = 50){
    socket.emit('fpsset',val)    
    return 'fps = '+ 1000/val + '  ('+val+')'
}
function drawHover(xM = posX, yM = posY, x1, y1, w, h, c1 = 'white',c2 = 'black') {
    if (x1 < xM && xM < x1 + w && y1 < yM && yM < y1 + h) {
        c.fillStyle = c1
        c.fillRect(x1, y1, w, h)
    } else {
        c.fillStyle = c2
        c.fillRect(x1, y1, w, h)
    }
}
function onhover(xM = posX, yM = posY, x1, y1, w, h) {
    return x1 < xM && xM < x1 + w && y1 < yM && yM < y1 + h
}
function fillCard(x, y, w, h, r, cor = 'white') {
    c.fillStyle = cor
    c.beginPath()
    c.arc(x + r, y + r, r, Math.PI, 3 / 2 * Math.PI);
    c.moveTo(x + r, y)
    c.lineTo(x, y + r)
    c.lineTo(x + r, y + r)
    c.fill()
    c.closePath()
    c.beginPath()
    c.arc(x + w - r, y + r, r, 3 / 2 * Math.PI, 0);
    c.moveTo(x + w - r, y)
    c.lineTo(x + w - r, y + r)
    c.lineTo(x + w, y + r)
    c.fill()
    c.beginPath()
    c.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    c.moveTo(x + r, y + h - r)
    c.lineTo(x + r, y + h)
    c.lineTo(x, y + h - r)
    c.fill()
    c.beginPath()
    c.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    c.moveTo(x + w - r, y + h - r)
    c.lineTo(x + w - r, y + h)
    c.lineTo(x + w, y + h - r)
    c.fill()
    c.fillRect(x, y + r, w, h - 2 * r)
    c.fillRect(x + r, y, w - 2 * r, r)
    c.fillRect(x + r, y + h - r, w - 2 * r, r)

}
function fillHover(xM = posX, yM = posY, x1, y1, w, h,r, c1 = 'white', c2 = 'black') {
    if (x1 < xM && xM < x1 + w && y1 < yM && yM < y1 + h) {
        fillCard(x1, y1, w, h,r, c1)
    } else {
        fillCard(x1, y1, w, h,r, c2)
    }
}
function strokeCard(x, y, w, h, r, cor = 'black', lW = 5) {
    c.strokeStyle = cor
    c.lineWidth = lW
    c.beginPath()
    c.moveTo(x, y + r)
    c.lineTo(x, y + h - r)
    c.moveTo(x + w, y + r)
    c.lineTo(x + w, y + h - r)
    c.moveTo(x + r, y)
    c.lineTo(x + w - r, y)
    c.moveTo(x + r, y + h)
    c.lineTo(x + w - r, y + h)
    c.stroke()
    c.beginPath()
    c.arc(x + r, y + r, r, Math.PI, 3 / 2 * Math.PI);
    c.stroke()
    c.beginPath()
    c.arc(x + w - r, y + r, r, 3 / 2 * Math.PI, 0);
    c.stroke()
    c.beginPath()
    c.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    c.stroke()
    c.beginPath()
    c.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    c.stroke()
}
function strokeHover(xM = posX, yM = posY, x1, y1, w, h, r, c1 = 'white', c2 = 'black' , lw = 5) {
    if (x1 < xM && xM < x1 + w && y1 < yM && yM < y1 + h) {
        strokeCard(x1, y1, w, h,r, c1, lw)
    } else {
        strokeCard(x1, y1, w, h, r, c2, lw)
    }
}
render = function(){   
    c.clearRect(0, 0, cW, cH)
    c.fillStyle = 'rgba' + players[ind].color.slice(3, players[ind].color.length-1) + ',0.1)'
    c.fillRect(0,0,cW,cH)

    var listaordem = []
    if(players[ind].ingame){
        c.strokeStyle = players[ind].color
        c.lineWidth = tl/7
        c.strokeRect(grid.x1, grid.y1, grid.t, grid.t)        
        fillHover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl, tl, 'rgba(11,0,255,0.12)', 'rgba(11,100,255,0.1)')
        strokeHover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl, tl, 'rgba(11,0,255,0.2)', 'rgba(11,100,255,0.3)')

        c.fillStyle = 'black'
        c.textBaseline = 'middle'
        c.textAlign = 'center'
        c.font = 1.5 * grid.unit + 'px arial'
        c.fillText('Sair', tl*5, cH - 1.5 * tl)
        
        for (let i in inplay) {
            listaordem.push({ n: inplay[i].body.length, color: inplay[i].color, name: inplay[i].name, id: inplay[i].id })
        }
        listaordem.sort(function (b, a) {
            return a.n - b.n;
        });
        
        for(let i in listaordem){
            c.textBaseline = 'bottom'
            c.textAlign = 'end'
            c.font = 2 * grid.unit + 'px arial'
            c.fillStyle = listaordem[i].color
            c.fillText(listaordem[i].n, grid.x2 - 2.4 * grid.unit*i, grid.y1 - 2)
            if(listaordem[i].name == localP.name){
                c.fillStyle = 'black'
                c.textBaseline = 'top'
                c.textAlign = 'center'
                c.font = 1.5 * grid.unit + 'px arial'
                c.fillText(parseInt(parseInt(i)+1) + '°',cW/2, 10)
            }
        }
        for(let m in macas){
            c.fillStyle = macas[m].color
            c.fillRect(grid.x1 + macas[m].ix * grid.unit, grid.y1 + macas[m].iy * grid.unit, grid.unit, grid.unit)
        }
        for(let i in inplay){
            for(let j in inplay[i].body){
                c.fillStyle = inplay[i].dead?'red':inplay[i].color
                c.fillRect(grid.x1 + inplay[i].body[j].ix * grid.unit, grid.y1 + inplay[i].body[j].iy * grid.unit, grid.unit, grid.unit)
            }
        }
        
        //socket.emit('updatesnake', {body:snake.body, ind:ind});
    }else{
        var grd1 = c.createLinearGradient(0, grid.y1 , 0, grid.y1 + grid.t);
        grd1.addColorStop(0, "rgba(0,230,255,0.8)");
        grd1.addColorStop(0.5, "rgba(0,255,255,0.5)");
        grd1.addColorStop(1, "rgba(0,230,255,0.8)");
        var grd2 = c.createLinearGradient(0, grid.y1, 0, grid.y1 + grid.t);
        grd2.addColorStop(0, "rgba(0,255,230,0.8)");
        grd2.addColorStop(0.5, "rgba(0,255,255,0.5)");
        grd2.addColorStop(1, "rgba(0,255,255,0.8)");
        fillHover(posX,posY,grid.x1, grid.y1, grid.t, grid.t ,grid.t/8, grd1,grd2)
        strokeHover(posX, posY, grid.x1, grid.y1, grid.t, grid.t, grid.t / 8, 'rgb(0,0,150)', 'rgb(100,100,200)')
        c.fillStyle = 'black'
        c.textBaseline = 'middle'
        c.textAlign = 'center'
        c.font = 3*grid.unit+'px arial'
        c.fillText('Jogar',cW/2,cH/2)
        var grd3 = c.createLinearGradient(cW * 0.4, 0, cW * 0.6, 0);
        grd3.addColorStop(0, 'rgba' + players[ind].color.slice(3, players[ind].color.length - 1) + ',1)');
        grd3.addColorStop(0.5, 'rgba' + players[ind].color.slice(3, players[ind].color.length - 1) + ',0.8)');
        grd3.addColorStop(1, 'rgba' + players[ind].color.slice(3, players[ind].color.length - 1) + ',1)');
        c.fillStyle = grd3
        c.textBaseline = 'bottom'
        c.textAlign = 'center'
        c.font = 0.9 * grid.unit + 'px arial'
        c.fillText('Um oferecimento de Jorge BC, socket.io e express', cW / 2, cH)

    }
    fillHover(posX, posY, tl, tl, tl * 11, 2 * tl + tl * players.length, tl, 'rgba(11,100,255,0.2)', 'rgba(11,100,255,0.12)')
    strokeHover(posX, posY, tl, tl, tl * 11, 2 * tl + tl * players.length, tl, 'rgba(11,100,255,0.5)', 'rgba(11,0,255,0.12)')
    c.fillStyle = 'green'
    c.textBaseline = 'top'
    c.textAlign = 'center'
    c.font = tl*0.9 + 'px arial'
    c.fillText('Online', tl * 6.5, tl*1.2 )
    for(let i in players){
        c.fillStyle = 'black'
        c.textBaseline = 'top'
        c.textAlign = 'start'
        c.font = tl * 0.9 + 'px arial'
        if(players[i].ingame){
            var str = ' 🐍'
            if(listaordem.length!=0){
                if(listaordem[0].name == players[i].name){
                    str = ' 🐍🏆'
                }
            }
            c.fillText(players[i].name + str, 2.6 * tl, 2.6 * tl + tl*1.08 * i)

        }else{
            c.fillText(players[i].name + ' 🍄', 2.6 * tl, 2.6 * tl + tl * 1.08 * i)
        }
        /*c.textBaseline = 'center'
        c.fillStyle = 'green'
        c.font = tl * 0.5 + 'px arial'
        c.fillText('🟢', 1.2 * tl, 2.5 * tl + tl * i)*/
        c.fillStyle = players[i].color
        c.fillRect(tl * 1.5, 2.6 * tl + tl * 1.08 * i,tl*0.9,tl*0.9)
        c.strokeStyle = 'rgba(0,0,0,1)'
        c.lineWidth = 1
        c.strokeRect(tl * 1.5, 2.6 * tl + tl * 1.08 * i, tl * 0.9, tl * 0.9)
        
    }
    
    fillHover(posX, posY, cW - 1.45 * tl, cH - 1.5 * tl, tl, tl,0, 'rgb(50,100,255,0.7)', 'rgba(50,100,255,0.3)')
    fillHover(posX, posY, cW - 2.55 * tl, cH - 1.5 * tl, tl, tl, 0, 'rgb(50,100,255,0.7)', 'rgba(50,100,255,0.3)')
    c.textBaseline = 'bottom'
    c.textAlign = 'start'
    c.font = tl*0.8  + 'px arial'
    c.fillStyle = 'black'
    if (audio.paused){
        c.fillText('🔇', cW - 2.6 * tl, cH - 0.5 * tl)
    }else{
        c.fillText('🎵', cW - 2.6 * tl, cH - 0.5 * tl)
    }
    if (efectON % 2 == 1) {
        c.fillText('🔊', cW - 1.5 * tl, cH - 0.5 * tl)
    } else {
        c.fillText('🔇', cW - 1.5 * tl, cH - 0.5 * tl)
    }    
}
update = function(){
    requestAnimationFrame(update, c)
    render()
}
// LOOP QUE MOVE E RENDERIZA
update();
// ONDE TODA A MÁGICA AKONTECE

