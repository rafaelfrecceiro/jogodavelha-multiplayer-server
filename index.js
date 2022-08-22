const express = require('express');
const http = require('http')
const {Server} = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', '´POST']
    }
});

let clients = []

io.on('connection', socket => {
    clients.push(socket)
    console.log("Cliente connected: "+ socket.id)

    if(clients.length >= 2){
        clients[1].broadcast.emit('startingGame', {})
    }

    socket.on('sendMessage', data => {
      console.log('Message receive in server:', data)
        socket.broadcast.emit('messageReceive', {
            namePlayer: data.namePlayer,
            inputMessage: data.inputMessage
        })
    })
    socket.on('optionsSend', data => {
        console.log('Option receive in server:', data)
        socket.broadcast.emit('optionsReceive', {
            position: data.position
        })
    })

    socket.on('losingGame', data => {
        console.log('Game over in server:', data)
        socket.broadcast.emit('losingGame', {})
    })

    console.log("Jogadores online: "+ clients.length)
})

server.listen(3000, () => {
    console.log('Server started')
})
