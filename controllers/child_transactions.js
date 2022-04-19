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
    transactions = await child.findById(id).select({ transactions });
    res.status(200).send(transactions);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getTasksById = async (req, res, next) => {
  console.log("getTasksById");

  try {
    tasks = await Task.findById(req.params.id);
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const addTransaction = async (req, res, next) => {
  console.log("addTransaction");

  const description = req.body.description;
  const amount = req.body.amount;

  const newTransaction = {
    description: description,
    amount: amount,
  };

  try {
    const id = req.body.id; 
    const child = await Child.findOne({ _id: id });
    if (child == null) return sendError(res, 400, "Wrong email or password");

    child.transactions.push(newTransaction);
    child.balance += newTransaction.amount;
    const result = await child.save();

    res.status(200).send({
      status: "Ok",
      message: "A new transactiopn is added to child",
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = { getTransactions, addTransaction };
