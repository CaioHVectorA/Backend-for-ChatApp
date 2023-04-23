const express = require('express')
const mongoose = require('mongoose')
const Route = express.Router()
const CHATS = mongoose.model('Chat', {
    ID: Number,
    Users: Array,
    Messages: Array
})

const USERS = mongoose.model('Usuário',{
    Nome: String,
    Senha: String
})
Route.get('/User',async (req, res) => {
    const usuarios = await USERS.find()
    let tempdb = []
    usuarios.forEach((item) => tempdb.push(item))
    // const uniqueDB = [... new Set(tempdb.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
    return res.json(tempdb)
})

Route.post('/User', async (req, res) => {
    const {Nome, Senha} = req.body
    const usuarios = await USERS.find()
    let yetExist = null
    let Login = null
    usuarios.forEach((item) => {
        if (item.Nome === Nome) {
            console.log('Nome Igual')
            if (item.Senha === Senha) {
                console.log('Log-in')
                Login = true
            } else {
                console.log('Nome mas senha incorreta')
                yetExist = [202,'Senha Incorreta.']
            }
        }
    })
    if (Login) {
        return res.status(201).json({message: 'Logado com sucesso'})    
    }
    if (yetExist) {
        console.log('Já existe')
        return res.status(yetExist[0]).json({message: yetExist[1]})
    }
    let User = {
        Nome,
        Senha
    }
    
    try {
        console.log('Tentando criar',User)
        await USERS.create(User)
        return res.status(201).json({message: 'Usuário criado.'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

Route.get('/chat', async (req, res) => {
    const chats = await CHATS.find()
    let db = []
    chats.forEach((item) => db.push(item))
    return res.json(db)
})

Route.post('/chat', async (req, res) => {
    console.log(req.body)
    const chats = await CHATS.find()
    let yetExist = null;
    const {ID, User} = req.body
    if (!ID) {
        return res.status(404).json({error: 'Coloque um ID.'})
    }
    chats.forEach((item) => {
        if (item.ID == ID) {
            yetExist = true
        }
    }) 
    if (yetExist) {
        return res.status(404).json({error: 'ID já usado.'})
    }

    let Chat = {
        ID: ID,
        Users: User,
        Message: []
    }
    await CHATS.create(Chat)
    return res.status(201).json({message: 'Chat Criado Com Sucesso!'})
})

Route.get('/chats/:id', async (req, res) => {
    const id = req.params.id
    const chats = await CHATS.find()
    const chatid = chats.find(chat => chat.ID == id)
    if (chatid) {
        return res.json(chatid)
    } else {
        return res.status(401).json({error: 'Chat não encontrado'})
    }
})
Route.get('/chats/:id/msgs', async (req, res) => {
    const id = req.params.id
    const chats = await CHATS.find()
    const chatid = chats.find(chat => chat.ID == id)
    if (chatid) {
        return res.json(chatid.Messages)
    } else {
        return res.status(401).json({error: 'Chat não encontrado'})
    }
})

Route.delete('/chat', async (req, res) => {
    const chats = await CHATS.deleteMany()
    return res.status(200).json({message: 'deletado com sucesso.'})
})
Route.delete('/User', async (req, res) => {
    const usersdeleted = await USERS.deleteMany()
    return res.status(200).json({message: 'deletado com sucesso.'})
})

Route.patch('/chat/newUser/:id', async (req, res) => {
    const id = req.params.id
    const {newUser} = req.body
    const chatatual = await CHATS.findOne({ID: id})
    let full;
    if (chatatual.Users.length > 1) {
        full = true
    } else {
        chatatual.Users.push(newUser)
    }
    if (full) {
        return res.status(404).json({error: 'O Chat já tem 2 pessoas.'})
    }
    await chatatual.save()
    res.status(200).json({message: 'Atualizado com sucesso!'})
})

Route.patch('/chat/newMsg/:id', async (req, res) => {
    const id = req.params.id
    const {Message, User} = req.body
    const chatatual = await CHATS.findOne({ID: id})
    let newMsg = {
        User,
        Message,
    }
    chatatual.Messages.push(newMsg)
    await chatatual.save()
    return res.status(200).json({message: 'Nova mensagem criada!'})
})
module.exports = Route