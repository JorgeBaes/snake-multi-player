//cd C:\Users\User\Desktop\Programações em JS\jogocomsocket



var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
server.listen(process.env.PORT || 3000);
console.log('ouvindo na porta 3000 malucoo')
//process.env.PORT || 3000


var players = []
var macas = []

const quad = function (x, y, cor = 'black') {
    this.ix = x
    this.iy = y
    this.t = 10
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
        if (this.body.length < 49) {
            this.body[j].cor = `rgb(${co},${co},${this.body.length / 50 * 255})`
        } else {
            this.body[j].cor = `rgb(${255},${co},${co})`
        }
        co += 120 / (this.body.length - 1)
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
                for (let j in this.body) {
                    if (this.body.length < 49) {
                        this.body[j].cor = `rgb(${co},${co},${this.body.length / 50 * 255})`
                    } else {
                        this.body[j].cor = `rgb(${255},${co},${co})`
                    }
                    co += 120 / (this.body.length - 1)
                }
            }
        }
    }

}
checkmaca = function (obj) {
    for (let i in macas) {
        if (macas[i].ix == obj.body[0].ix && macas[i].iy == obj.body[0].iy) {
            var coloro = macas[i].cor 
            macas.splice(i, 1)
            return coloro          
        }
    }
    return false
}
var mg = 30
var fps = 90
io.sockets.on('connection', function (socket) {
    console.log('Client connected... ' + socket.id);
    socket.on('playersupdate', function (data) {
        players.push(data)
        io.emit('playersupdate',players)
    });
    socket.on('playerjoin', function (data) {
        players[data.ind] = data.p
        io.emit('playersupdate', players)
    })
    socket.on('updatesnake', function (data) {        
        players[data.ind].body = data.body 
        var check = checkmaca(players[data.ind])
        if (check == 'red'){
            players[data.ind].body.push(new quad(0,0))
            data.body = players[data.ind].body
            io.emit('updatesnakeesp', data)
            io.emit('redcaptured',data.ind)
        } else if (check == 'purple'){            
           for(let i in players){
               if (i != data.ind && players[i].body.length > 3){
                   players[i].body.pop()
                   io.emit('updatesnakeesp', { body: players[i].body, ind:i})
                   io.emit('purplecaptured',i)
               }else{
                   io.emit('purplecaptured', -12)
               }
           }
        } else if (check == 'orange') {             
            let rand = Math.random()
            if(rand<0.4){
                let rand1 = ~~(Math.random() * mg)
                let rand2 = ~~(Math.random() * mg)
                let rand3 = ~~(Math.random() * mg)
                let rand4 = ~~(Math.random() * mg)
                macas.push(new quad(players[data.ind].body[0].ix, rand2, 'red'))
                macas.push(new quad(players[data.ind].body[0].ix, rand4, 'red'))
                macas.push(new quad(rand3, players[data.ind].body[0].iy, 'red'))
                macas.push(new quad(rand1, players[data.ind].body[0].iy, 'red'))
                io.emit('orangecaptured', data.ind)

            }            
        }else{
            io.emit('updatesnake', data)
        }
        io.emit('updatemaca', macas)
    })
    socket.on('requiremaca', function (data) {
        let xrand = ~~(Math.random() * data)
        let yrand = ~~(Math.random() * data)
        let x2rand = ~~(Math.random() * data)
        let y2rand = ~~(Math.random() * data)
        let x3rand = ~~(Math.random() * data)
        let y3rand = ~~(Math.random() * data)
        let randoo1 = Math.random()
        let randoo2 = Math.random()
        if(randoo1<0.2){
            macas.push(new quad(x2rand, y2rand, 'purple'))
        }
        if(randoo2<0.3){
            macas.push(new quad(x3rand, y3rand, 'orange'))
        }
        macas.push(new quad(xrand, yrand, 'red'))  
        io.emit('updatemaca', macas)
    })
    socket.on('disconnect', function () {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === socket.id) {
                players.splice(i, 1)
            }
        }
        if(players.length == 0){
            macas = []
        }
        io.emit('playersupdate', players)
    })
    socket.on('definefps', function (d) {        
        io.emit('definefps', d)
    })
    socket.on('definemacatime', function (d) {
        io.emit('definemacatime', d)
    })
});


