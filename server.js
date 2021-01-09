const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid')
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    // 메인 도메인에 들어가면 아이디를 할당해줌
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

// io: socket.io packate
// socket: connection information when connected
io.on('connection', socket => {
    // implement event listener
    // get information from script.js
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId)
        socket.join(roomId)
        //send information about userId
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})

server.listen(3000);