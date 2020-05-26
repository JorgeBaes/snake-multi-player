var socket = io.connect('https://multiplayer-snake-io.herokuapp.com/');
//https://multiplayer-snake-io.herokuapp.com/
var corusuario = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
var localP = { name: undefined, id: undefined, confirm: undefined, ingame: false, body: null, color: corusuario }

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
    localP = { name: nick, id: socket.io.engine.id, confirm: 0, ingame: false, body: null, color:corusuario }
    socket.emit('playersupdate',localP);
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

const quad = function (x, y, cor = 'black') {
    this.ix = x
    this.iy = y
    this.t = grid.unit
    this.cor = cor
    this.px = this.x
    this.py = this.y

    this.draw = function (color = this.cor) {
        c.fillStyle = color
        c.fillRect(grid.x1 + this.ix * grid.unit, grid.y1 + this.iy * grid.unit, this.t, this.t)
    }
}
const cobra = function () {
    this.dead = false
    this.contdead = 0
    this.body = [new quad(~~(maxgrid / 2), ~~(maxgrid / 2)),
    new quad(~~(maxgrid / 2) + 1, ~~(maxgrid / 2)),
    new quad(~~(maxgrid / 2) + 2, ~~(maxgrid / 2)),
    new quad(~~(maxgrid / 2) + 37, ~~(maxgrid / 2)),
    new quad(~~(maxgrid / 2) + 38, ~~(maxgrid / 2))]

    var co = 0
    for (let j in this.body) {
        this.body[j].cor = corusuario
    }
    this.draw = function () {
        if (this.dead) {
            this.contdead++
        }
        if (this.contdead > 50) {
            this.dead = false
        }

        if (cima) {
            this.body[0].iy -= esp
        }
        if (baix) {
            this.body[0].iy += esp
        }
        if (dire) {
            this.body[0].ix += esp
        }
        else if (esqr) {
            this.body[0].ix -= esp
        }
        if (this.body[0].ix == grid.mg) {
            this.body[0].ix = 0
        }
        else if (this.body[0].ix == -1) {
            this.body[0].ix = grid.mg - 1
        }
        if (this.body[0].iy == grid.mg) {
            this.body[0].iy = 0
        }
        else if (this.body[0].iy == -1) {
            this.body[0].iy = grid.mg - 1
        }
        for (let i in this.body) {
            if (i > 0) {
                this.body[i].ix = this.body[i - 1].px
                this.body[i].iy = this.body[i - 1].py
            }
            if (this.dead) {
                this.body[i].draw('red')
            } else {
                this.body[i].draw()
            }
        }
        for (let i in this.body) {
            this.body[i].px = this.body[i].ix
            this.body[i].py = this.body[i].iy
        }

    }
    this.checkselfcol = function () {
        if (!this.dead) {
            for (let i in this.body) {
                if (this.body.some((el, j) => { return j != i && el.ix == this.body[i].ix && el.iy == this.body[i].iy })) {
                    var len = this.body.length
                    this.body.pop()
                    if (efectON % 2 == 1) {
                        let rand = 1 + ~~(Math.random() * 5)
                        var audi = new Audio('agressao' + rand + '.mp3')
                        audi.volume = volEfect
                        audi.play()
                    }                    
                    this.dead = true
                    this.contdead = 0
                    break;
                }
            }
        }
    }
    this.checkmaca = function () {
        for (let i in macas) {
            if (macas[i].ix == this.body[0].ix && macas[i].iy == this.body[0].iy) {
                macas.splice(i, 1)
                this.body.push(new quad(0, 0))
                var co = 0
                for (let j in this.body) {/*
                    if (this.body.length < 49) {
                        this.body[j].cor = `rgb(${co},${co},${this.body.length / 50 * 255})`
                    } else {
                        this.body[j].cor = `rgb(${255},${co},${co})`
                    }
                    co += 120 / (this.body.length - 1)
                    */
                    this.body[j].cor = players[ind].color
                }
            }
        }
    }

}
var audio = new Audio()
audio.pause()
var snake = new cobra()
canvas.onmousedown = function(event){ 
    if (onhover(posX, posY, tl, tl, tl * 10, 2 * tl + tl * players.length)){
        corusuario = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
        localP.color = corusuario
        players[ind] = localP
        socket.emit('playerjoin', { p: players[ind], ind: ind });
        for(let i in snake.body){
            snake.body[i].cor = corusuario
        }
    }
    if (onhover(posX, posY, grid.x1, grid.y1, grid.t, grid.t) && localP.ingame == false){
        localP.ingame = true
        localP.body = snake.body
        players[ind] = localP
        socket.emit('playerjoin', {p:players[ind],ind:ind});
    }
    if (onhover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl) && localP.ingame == true ){
        localP.ingame = false
        snake = new cobra()
        localP.body = snake.body
        players[ind] = localP
        con = 0
        socket.emit('playerjoin', { p: players[ind], ind: ind });
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
canvas.onmousemove = function(event){

}
canvas.onmouseup = function(event){

}
var esp = 1
var fps = 50
var macatime = 20
var volEfect = 0.3
var volSong  = 0.1

var cima = true
var baix = false
var dire = false
var esqr = false
const UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37, P = 80, C = 67, A = 65, S = 83; 
window.addEventListener('keydown', kd)                                         
function kd(e) {
    var key = e.keyCode
    if(key === UP){
        cima = true
        baix = false  
        dire = false
        esqr = false       
    }
    else if (key === DOWN) {
        cima = false
        baix = true
        dire = false
        esqr = false   
    }
    if (key === RIGHT) {
        dire = true
        esqr = false 
        cima = false
        baix = false 
    }
    else if (key === LEFT) {
        dire = false
        esqr = true  
        cima = false
        baix = false       
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
var trophy = -1
var count = 0
var tempo = 100+Math.random()*400
var macas = []
var musicON = 0
var efectON = 0
var players = []
var ind = 0
socket.on('playersupdate',(data)=>{
    players = data
    for (let i in players) {
        if (players[i].id == localP.id) {
            ind = i
        }
    }
})
socket.on('updatesnake', (data) => {
    if (data.ind != ind) {
        players[data.ind].body = data.body         
    }
    for (let i in players){
        for(let j in players[i].body){
            players[i].body[j].t = grid.unit
        }
    }    
})
socket.on('updatesnakeesp', (data) => {    
    players[data.ind].body = data.body    
    for (let i in players) {
        for (let j in players[i].body) {
            players[i].body[j].t = grid.unit
            players[i].body[j].cor = corusuario
        }
    }
    if(data.ind == ind){
        snake.body = players[data.ind].body
        for (let i in snake.body) {
            snake.body[i].draw = function (color = this.cor) {
                c.fillStyle = color
                c.fillRect(grid.x1 + this.ix * grid.unit, grid.y1 + this.iy * grid.unit, this.t, this.t)
            }
        }
    }
    
})
socket.on('updatemaca', (data) => {
    macas = data
    for(let i in macas){
        macas[i].t = grid.unit
    }
})

socket.on('redcaptured', (data) => {
    if(data == ind && efectON%2==1){
        let rand = 2+~~(Math.random()*8)
        var audi = new Audio('blop'+rand+'.mp3')
        audi.volume = volEfect
        audi.play()

    }
})
socket.on('orangecaptured', (data) => {
    if (data == ind && efectON % 2 == 1) {
        let rand = Math.random()
        var stri = 'blop1.mp3'
        if(rand<0.3){
            stri = 'orange.mp3'
        } else if (rand < 0.6) {
            stri = 'nunao.mp3'
        }
        var audi = new Audio(stri)
        audi.volume = volEfect
        audi.play()

    }
})
socket.on('purplecaptured', (data) => {
    if (data == ind && efectON % 2 == 1) {
        let rand = 1 + ~~(Math.random() * 5)
        var audi = new Audio('resmungo' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()
    } else if (data == -12 && efectON % 2 == 1){
        let rand = 1 + ~~(Math.random() * 5)
        var audi = new Audio('come' + rand + '.mp3')
        audi.volume = volEfect
        audi.play()
    }
})


function fpsSet(val){
    socket.emit('definefps',val);    
}
socket.on('definefps', (val) => {
    if(fps>=0){
        fps = val   
    } 
})
function macatimeSet(val) {
    socket.emit('definemacatime', val);
}

socket.on('definemacatime', (val) => {
    if (val >= 0 && val<200) {
        macatime = val
    }
})
function drawrect(obj){
    c.fillRect(grid.x1 + obj.ix * grid.unit, grid.y1 + obj.iy * grid.unit, obj.t, obj.t)
}
con = 0
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
    c.fillStyle = 'rgba'+corusuario.slice(3,corusuario.length-1) + ',0.1)'
    c.fillRect(0,0,cW,cH)

    var listaordem = []
    if(localP.ingame){
        c.strokeStyle = corusuario
        c.lineWidth = tl/7
        c.strokeRect(grid.x1, grid.y1, grid.t, grid.t)
        if (con < 105 && (cima || baix || dire || esqr)) {
            con++
        }
        snake.draw()
        if (con > 100) {
            snake.checkselfcol()
        }
        for(let i in players){
            if(players[i].ingame && i != ind){
                for(let j in players[i].body){
                    c.fillStyle = players[i].color
                    drawrect(players[i].body[j])
                }                  
            }
        }
        for (let i in macas) {
            c.fillStyle = macas[i].cor
            drawrect(macas[i])
        }
        
        count++
        if (count > tempo) {
            socket.emit('requiremaca',grid.mg);
            count = 0
            tempo = macatime + Math.random() * (200-macatime)
        }
        fillHover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl, tl, 'rgba(11,0,255,0.12)', 'rgba(11,100,255,0.1)')
        strokeHover(posX, posY, tl, cH - 3 * tl, 8 * tl, 3 * tl, tl, 'rgba(11,0,255,0.2)', 'rgba(11,100,255,0.3)')

        c.fillStyle = 'black'
        c.textBaseline = 'middle'
        c.textAlign = 'center'
        c.font = 1.5 * grid.unit + 'px arial'
        c.fillText('Sair', tl*5, cH - 1.5 * tl)
        
        for (let i in players) {
            if (players[i].ingame) {
                listaordem.push({ n: players[i].body.length, color: players[i].color, name: players[i].name, id: players[i].id})
            }
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



        socket.emit('updatesnake', {body:snake.body, ind:ind});
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
    setTimeout(function(){
        requestAnimationFrame(update, c)
        render()
    },fps)
}
// LOOP QUE MOVE E RENDERIZA
update();
// ONDE TODA A MÁGICA AKONTECE

