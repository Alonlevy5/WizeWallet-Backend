const { Router } = require('express')
const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.send('Hello World! From ROUTER!')
})

module.exports = router