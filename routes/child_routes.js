const express = require("express");
const router = express.Router();

const childApi = require("../controllers/childAPI");
const authenticate = require("../common/auth_middleware");

//TODO: implement Swagger

router.get("/transactions", authenticate, childApi.getTransactions);

router.post("/transactions", authenticate, childApi.addTransaction);

router.get("/balance", authenticate, childApi.getBalance);

router.post("/balance", authenticate, childApi.updateBalance);

module.exports = router;
