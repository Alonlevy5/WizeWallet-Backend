const express = require('express')
const router = express.Router()

const Task = require('../controllers/task')
router.get('/', Task.getTasks)
router.get('/:id', Task.getTasksById)
router.post('/', Task.addTasks)

module.exports = router