const express = require("express");
const router = express.Router();

const Auth = require("../controllers/auth");

/**
 * @swagger
 * 
 * */

router.post("/register", Auth.register);

router.post("/login", Auth.login);

router.post("/logout", Auth.logout);

router.post('/refreshToken', Auth.refreshToken)

module.exports = router;
