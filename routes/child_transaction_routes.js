const express = require("express");
const router = express.Router();

const Transaction = require("../controllers/child_transactions");
const authenticate = require("../common/auth_middleware");

//TODO: implement Swagger

router.get("/", authenticate, Transaction.getTransactions);

router.post("/", authenticate, Transaction.addTransaction);

module.exports = router;
