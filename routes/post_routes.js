const express = require('express')
const router = express.Router()

const Post = require('../controllers/posts')

router.get('/',Post.getPosts)

module.exports = router