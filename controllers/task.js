const Task = require("../models/task_model");
const Child = require("../models/child_model")

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

const getTaskSendByParent = async (req, res, next) => {
  console.log("getTaskSendByParent");
  const sender = req.user._id
  const kidid = req.body.kidid

  try {
    tasks = await Task.find({ sender: sender, kidid: kidid })
    console.log("getTaskSendByParent " + sender)
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });

  }
}

const taskCompleted = async (req, res, next) => {
  console.log("taskCompleted")
  const loggedChild = req.user._id;
  taskID = req.body._id

  try {
    task = await Task.findById(taskID)
    task.isCompleted = true;
    await task.save()
    res.status(200).send(task)

  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
}

const parentAcceptTaskCompleted = async (req, res, next) => {
  console.log("parentAcceptTaskCompleted");
  taskID = req.body._id

  try {
    const tasks = await Task.findById(taskID)
    if(tasks == (null || undefined))
    {
      return res.status(400).send({
        message: "Task is done already",
        status: "fail",
      });
    }
    const child = await Child.findOne({ _id: tasks.kidid });
    console.log("parentAcceptTaskCompleted Task id is " + taskID);
    if(tasks.isCompleted){
    child.balance += tasks.amount;
    const newTransaction = {
      amount: tasks.amount,
      description: tasks.message,
      createdat: tasks.createdat,
      istransact: false,
    };
    child.transactions.push(newTransaction);
    console.log(child)
    await Task.findByIdAndDelete(taskID)
    await child.save()
    // await tasks.save()
    res.status(200).send({
      newBalance: child.balance,
      addedTransaction: newTransaction,
    });
  }else{
    return res.status(400).send({
      message: "Task isnt completed",
      status: "Let child complete first",
    });
  }
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
    createdat: req.body.createdat,
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

module.exports = { getTasks, getTasksBykidId, addTasks, getTaskSendByParent, taskCompleted, parentAcceptTaskCompleted };
