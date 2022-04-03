const getTasks = async (req, res, next) => {
    res.send('This is my Tasks')
}

module.exports = { getTasks }