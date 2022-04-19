const Task = require("../models/task_model");

const getTasks = async (req, res, next) => {
  console.log("getTasks");

  try {
    tasks = await Task.find();
    console.log("get all tasks OK");
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getTasksBykidId = async (req, res, next) => {
  console.log("getTasksBykidId");
  sender = req.user._id;
  try {
    tasks = await Task.find({ kidid: sender })
    console.log("getTasksBykidId Child id is: " + sender);
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};


const addTasks = async (req, res, next) => {
  console.log("addTasks " + req.body.message);

  sender = req.user._id;

  const newTask = Task({
    kidid: req.body.kidid,
    message: req.body.message,
    amount: req.body.amount,
    sender: sender,
  });

  try {
    task = await newTask.save();

    console.log("add new task OK");
    res.status(200).send({
      status: "Ok",
      task: newTask,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = { getTasks, getTasksBykidId, addTasks };
