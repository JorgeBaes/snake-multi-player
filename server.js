
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
server.listen(3000);
console.log('ouvindo na porta 3000 malucoo')
//process.env.PORT || 3000


var players = []
var inplay  = []
var macas = [] 
var timeRando = 100+Math.random()*100
var contTime  = 0
var mg = 30
var fps = 55

var RED = 'red'
var PURPLE = 'purple'
var ORANGE = 'orange'

var spart = function (ix = 0, iy = 0) {
    this.ix = ix
    this.iy = iy
    this.px = this.ix
    this.py = this.iy
}


io.sockets.on('connection', function (socket) {
    console.log('Client connected... ' + socket.id);
    socket.on('newjoiner', function (data) {
        players.push(data)
        io.emit('playersupdate',players)
    })      
    socket.on('disconnect', function () {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === socket.id) {
                players.splice(i, 1)
            }
        }
        for (var i = 0; i < inplay.length; i++) {
            if (inplay[i].id === socket.id) {
                inplay.splice(i, 1)
            }
        }
        if(players.length == 0){
            macas = []
        }
        io.emit('playersupdate', players)
        io.emit('inplayupdate', inplay)
    })    
    socket.on('playerjogar',(ind)=>{
        var randx = 2 + ~~(Math.random()*mg - 2)
        var randy = 15

        const jogador = {            
            body: [new spart(randx, randy), new spart(randx, randy + 1), new spart(randx, randy + 2), new spart(randx, randy + 3), new spart(randx, randy+4)],      
            color:players[ind].color,
            ori:'T',
            dead:false,
            contdead:0,
            name:players[ind].name,
            id:players[ind].id 
        };
        players[ind].ingame = true
        io.emit('playersupdate', players)        
        inplay.push(jogador)  
        io.emit('inplayupdate', inplay)
        io.emit('macasupdate', macas) 
    })
    socket.on('playersupdatecolor',(d)=>{
        var index = -1
        for (let i in inplay) {
            if (inplay[i].id == players[d.ind].id) {
                index = i
            }
        }
        if(index!=-1){
            inplay[index].color = d.color
            io.emit('inplayupdate', inplay)
        }
        players[d.ind].color = d.color
        io.emit('playersupdate', players)
    })
    socket.on('stateUpdate', (d) => {        
        inplay[d.indINPLAY].ori = d.ori
    })
    socket.on('playersair',(id)=>{
        for(let i in inplay){
            if(inplay[i].id == id){
                inplay.splice(i,1)
                break;
            }
        }
        for (let i in players) {
            if (players[i].id == id) {
                players[i].ingame = false
                break;
            }
        }
        if(inplay.length == 0){
            macas = []
        }
        io.emit('inplayupdate', inplay)
        io.emit('playersupdate', players)
        io.emit('macasupdate', macas)
    })
    socket.on('fpsset',(val)=>{
        if(val>10){
            fps = val
        }
    })
});
/*
setInterval(() => {
    if(inplay.length != 0){
        contTime++
        if (contTime > timeRando) {
            let xrand = ~~(Math.random() * mg)
            let yrand = ~~(Math.random() * mg)
            let x2rand = ~~(Math.random() * mg)
            let y2rand = ~~(Math.random() * mg)
            let x3rand = ~~(Math.random() * mg)
            let y3rand = ~~(Math.random() * mg)
            let randoo1 = Math.random()
            let randoo2 = Math.random()
            if (randoo1 < 0.2) {
                macas.push({ ix: x2rand, iy: y2rand, color: PURPLE })
            }
            if (randoo2 < 0.3) {
                macas.push({ ix: x3rand, iy: y3rand, color: ORANGE })
            }            
            macas.push({ ix: xrand, iy: yrand, color: RED })
            timeRando = 100 + Math.random() * 100
            contTime = 0
            io.emit('macasupdate',macas)
        } 
        for(let i in inplay){
            if (inplay[i].dead) {
                inplay[i].contdead++
            }
            if (inplay[i].contdead > 50) {
                inplay[i].dead = false
            }
            if (inplay[i].ori == 'T') {
                inplay[i].body[0].iy -= 1
            }
            if (inplay[i].ori == 'B') {
                inplay[i].body[0].iy += 1
            }
            if (inplay[i].ori == 'R') {
                inplay[i].body[0].ix += 1
            }
            else if (inplay[i].ori == 'L') {
                inplay[i].body[0].ix -= 1
            }
            if (inplay[i].body[0].ix == mg) {
                inplay[i].body[0].ix = 0
            }
            else if (inplay[i].body[0].ix == -1) {
                inplay[i].body[0].ix = mg - 1
            }
            if (inplay[i].body[0].iy == mg) {
                inplay[i].body[0].iy = 0
            }
            else if (inplay[i].body[0].iy == -1) {
                inplay[i].body[0].iy = mg - 1
            }
            for (let j in inplay[i].body) {
                if (j > 0) {
                    inplay[i].body[j].ix = inplay[i].body[j - 1].px
                    inplay[i].body[j].iy = inplay[i].body[j - 1].py
                }
            }
            for (let j in inplay[i].body) {
                inplay[i].body[j].px = inplay[i].body[j].ix
                inplay[i].body[j].py = inplay[i].body[j].iy                              
            } 
            for (let j in inplay[i].body) {
                if (!inplay[i].dead && inplay[i].body.length > 4) {
                    if (inplay[i].body.some((el, k) => { return j != k && el.ix == inplay[i].body[j].ix && el.iy == inplay[i].body[j].iy })) {
                        inplay[i].body.pop()
                        inplay[i].dead = true
                        inplay[i].contdead = 0
                        io.emit('agressao', inplay[i].id)
                        break;
                    }
                }
            }
            for(let m in macas){
                if (macas[m].ix == inplay[i].body[0].ix && macas[m].iy == inplay[i].body[0].iy){
                    if(macas[m].color == RED){
                        inplay[i].body.push(new spart(1000, 1000))
                        macas.splice(m, 1)
                        io.emit('redcaptured', inplay[i].id)
                    }else 
                    if (macas[m].color == ORANGE){
                        let rand = Math.random()
                        if (rand < 0.4) {
                            let rand1 = ~~(Math.random() * mg)
                            let rand2 = ~~(Math.random() * mg)
                            let rand3 = ~~(Math.random() * mg)
                            let rand4 = ~~(Math.random() * mg)
                            macas.push({ ix: inplay[i].body[0].ix, iy: rand1, color: RED })
                            macas.push({ ix: inplay[i].body[0].ix, iy: rand2, color: RED })
                            macas.push({ ix: rand3, iy: inplay[i].body[0].iy, color: RED })
                            macas.push({ ix: rand4, iy: inplay[i].body[0].iy, color: RED })
                            io.emit('orangecaptured', inplay[i].id)
                        } else if (rand < 0.9){
                            inplay[i].body.push(new spart(1000, 1000)) 
                            io.emit('redcaptured', inplay[i].id)
                         
                        }
                        macas.splice(m, 1) 
                    }else
                    if (macas[m].color == PURPLE) {                                     
                        var indice = 0
                        while(indice < inplay.length){
                            if(indice != i && inplay[indice].body.length>4){
                                inplay[indice].body.pop()
                            }
                            indice++
                        }
                        io.emit('purplecaptured', inplay[i].id)
                        macas.splice(m, 1)
                    }
                    io.emit('macasupdate', macas)                    
                }
            }         
        }
        io.emit('inplayupdate', inplay)
    }    
}, fps);
*/
var myfunc = () => {
    if (inplay.length != 0) {
        contTime++
        if (contTime > timeRando) {
            let xrand = ~~(Math.random() * mg)
            let yrand = ~~(Math.random() * mg)
            let x2rand = ~~(Math.random() * mg)
            let y2rand = ~~(Math.random() * mg)
            let x3rand = ~~(Math.random() * mg)
            let y3rand = ~~(Math.random() * mg)
            let randoo1 = Math.random()
            let randoo2 = Math.random()
            if (randoo1 < 0.2) {
                macas.push({ ix: x2rand, iy: y2rand, color: PURPLE })
            }
            if (randoo2 < 0.3) {
                macas.push({ ix: x3rand, iy: y3rand, color: ORANGE })
            }
            macas.push({ ix: xrand, iy: yrand, color: RED })
            timeRando = 60 + Math.random() * 100
            contTime = 0
            io.emit('macasupdate', macas)
        }
        for (let i in inplay) {
            if (inplay[i].dead) {
                inplay[i].contdead++
            }
            if (inplay[i].contdead > 50) {
                inplay[i].dead = false
            }
            if (inplay[i].ori == 'T') {
                inplay[i].body[0].iy -= 1
            }
            if (inplay[i].ori == 'B') {
                inplay[i].body[0].iy += 1
            }
            if (inplay[i].ori == 'R') {
                inplay[i].body[0].ix += 1
            }
            else if (inplay[i].ori == 'L') {
                inplay[i].body[0].ix -= 1
            }
            if (inplay[i].body[0].ix == mg) {
                inplay[i].body[0].ix = 0
            }
            else if (inplay[i].body[0].ix == -1) {
                inplay[i].body[0].ix = mg - 1
            }
            if (inplay[i].body[0].iy == mg) {
                inplay[i].body[0].iy = 0
            }
            else if (inplay[i].body[0].iy == -1) {
                inplay[i].body[0].iy = mg - 1
            }
            for (let j in inplay[i].body) {
                if (j > 0) {
                    inplay[i].body[j].ix = inplay[i].body[j - 1].px
                    inplay[i].body[j].iy = inplay[i].body[j - 1].py
                }
            }
            for (let j in inplay[i].body) {
                inplay[i].body[j].px = inplay[i].body[j].ix
                inplay[i].body[j].py = inplay[i].body[j].iy
            }
            for (let j in inplay[i].body) {
                if (!inplay[i].dead && inplay[i].body.length > 4) {
                    if (inplay[i].body.some((el, k) => { return j != k && el.ix == inplay[i].body[j].ix && el.iy == inplay[i].body[j].iy })) {
                        inplay[i].body.pop()
                        inplay[i].dead = true
                        inplay[i].contdead = 0
                        io.emit('agressao', inplay[i].id)
                        break;
                    }
                }
            }
            for (let m in macas) {
                if (macas[m].ix == inplay[i].body[0].ix && macas[m].iy == inplay[i].body[0].iy) {
                    if (macas[m].color == RED) {
                        inplay[i].body.push(new spart(1000, 1000))
                        macas.splice(m, 1)
                        io.emit('redcaptured', inplay[i].id)
                    } else
                        if (macas[m].color == ORANGE) {
                            let rand = Math.random()
                            if (rand < 0.4) {
                                let rand1 = ~~(Math.random() * mg)
                                let rand2 = ~~(Math.random() * mg)
                                let rand3 = ~~(Math.random() * mg)
                                let rand4 = ~~(Math.random() * mg)
                                macas.push({ ix: inplay[i].body[0].ix, iy: rand1, color: RED })
                                macas.push({ ix: inplay[i].body[0].ix, iy: rand2, color: RED })
                                macas.push({ ix: rand3, iy: inplay[i].body[0].iy, color: RED })
                                macas.push({ ix: rand4, iy: inplay[i].body[0].iy, color: RED })
                                io.emit('orangecaptured', inplay[i].id)
                            } else if (rand < 0.9) {
                                inplay[i].body.push(new spart(1000, 1000))
                                io.emit('redcaptured', inplay[i].id)

                            }
                            macas.splice(m, 1)
                        } else
                            if (macas[m].color == PURPLE) {
                                var indice = 0
                                while (indice < inplay.length) {
                                    if (indice != i && inplay[indice].body.length > 4) {
                                        inplay[indice].body.pop()
                                    }
                                    indice++
                                }
                                io.emit('purplecaptured', inplay[i].id)
                                macas.splice(m, 1)
                            }
                    io.emit('macasupdate', macas)
                }
            }
        }
        io.emit('inplayupdate', inplay)
    }
    setTimeout(myfunc, fps);
}

setTimeout(myfunc, fps);