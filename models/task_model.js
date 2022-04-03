const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Task', taskSchema)