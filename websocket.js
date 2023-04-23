const Main = require('./http')
const {http, io} = Main
const websocket = null
const users = [] // {ID,usuario, socket_id}
const msgs = [] // {usuario, mensagem,index, createdAt}
io.on("connection", socket => {
    socket.on('Credenciais',(data) => {
        socket.join(data.ID)
        const userInRoom = users.find(user => user.usuario === data.usuario && data.ID === user.ID)
        if (userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push({
                usuario: data.usuario,
                ID: data.ID,
                socket_id: socket.id
            })
        }

    })
    socket.on('message', (data) => {
        console.log(data)
        const message = {
            usuario: data.usuario,
            ID: data.ID,
            text: data.msg,
            createdAt: new Date()
        }
        msgs.push(message)
        
        io.to(data.ID).emit("message",message)
    })
})

module.exports = websocket 