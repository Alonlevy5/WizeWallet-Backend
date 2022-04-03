const express = require('express')
const router = express.Router()

const Task = require('../controllers/task')

router.get('/',Task.getTasks)

module.exports = router