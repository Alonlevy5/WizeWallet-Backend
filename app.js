const dotenv = require("dotenv").config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => {console.error(error)})
db.once('open', ()=> {console.log('Connected to Mongo Succesfully!')})

const port = process.env.PORT

const indexRouter = require('./routes/index')
app.use('/',indexRouter)

const postRouter = require('./routes/post_routes')
app.use('/post', postRouter)


app.listen(port, ()=> {
    console.log('Server is running on Port ' + port)
})