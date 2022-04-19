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

const getTasksById = async (req, res, next) => {
  console.log("getTasksById");

  try {
    tasks = await Task.findById(req.params.id);
    console.log("get taskById OK");
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

module.exports = { getTasks, getTasksById, addTasks };
