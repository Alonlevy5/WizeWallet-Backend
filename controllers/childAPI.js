const Child = require("../models/child_model");

function sendError(res, code, msg) {
  return res.status(code).send({
    status: "fail",
    eror: msg,
  });
}

const getTransactions = async (req, res, next) => {
  console.log("getTransactions");
  try {
    const id = req.user._id;
    transactions = await Child.findById(id).select("transactions");
    console.log("get all child transactions OK");
    res.status(200).send(transactions);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getBalance = async (req, res, next) => {
  console.log("getBalance");
  try {
    const id = req.user._id;
    balance = await Child.findById(id).select("balance");
    console.log("get balance OK");
    res.status(200).send(balance);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const updateBalance = async (req, res, next) => {
  console.log("updateBalance");
  const newBalance = req.body.balance;
  try {
    const id = req.user._id;
    const child = await Child.findOne({ _id: id });
    if (child == null) return sendError(res, 400, "No Child found.");

    child.balance += newBalance;
    const result = await child.save();

    console.log("update balance to child OK");
    res.status(200).send({
      status: "Ok",
      message: "Updated child's balance",
      balance: newBalance
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const addTransaction = async (req, res, next) => {
  // also updates child's balance
  console.log("addTransaction");

  const description = req.body.description;
  const amount = req.body.amount;

  const newTransaction = {
    description: description,
    amount: amount,
  };

  try {
    const id = req.user._id; 
    const child = await Child.findOne({ _id: id });
    if (child == null) return sendError(res, 400, "No Child found");

    child.transactions.push(newTransaction);
    child.balance += newTransaction.amount;
    const result = await child.save();
    console.log("transactions add to child OK");
    res.status(200).send({
      status: "Ok",
      message: "new transactiopn is added to child & the balance is updated acordingley",
      transaction: newTransaction,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  getBalance,
  updateBalance,
};
