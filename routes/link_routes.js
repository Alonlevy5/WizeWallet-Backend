const express = require("express");
const router = express.Router();

const Link = require("../controllers/link");
const authenticate = require("../common/auth_middleware");

router.get("/", authenticate, Link.getKids);

router.post("/", authenticate, Link.addKids);

module.exports = router;
