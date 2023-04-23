const websocket = require('./websocket')
const mongoose = require('mongoose')
const socket = require('socket.io')
const Main = require('./http')
const port = 4000||process.env.port
const {io, http} = Main
mongoose.set('strictQuery',false)
mongoose.connect('mongodb+srv://Caihe:89yyj3JqOQljtntv@chat.9gf4uj0.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    http.listen(port, () => console.log('servidor Rodando!'))
})
.catch(err => console.log(err))

