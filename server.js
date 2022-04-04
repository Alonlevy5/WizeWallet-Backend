const dotenv = require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb'}))
app.use(bodyParser.json())
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => {console.error(error)})
db.once('open', ()=> {console.log('Connected to Mongo Succesfully!')})

const port = process.env.PORT

const indexRouter = require('./routes/index')
app.use('/',indexRouter)

const taskRouter = require('./routes/task_routes')
app.use('/task', taskRouter)


module.exports = app