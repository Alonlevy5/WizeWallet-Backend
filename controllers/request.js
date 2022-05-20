const Request = require("../models/request_model");
const Child = require("../models/child_model");
const { request } = require("express");


const addRequest = async (req, res, next) => {
  console.log("addRequest");

  const newRequest = Request({
    amount: req.body.amount,
    message: req.body.message,
    sender: req.user._id,
  });

  try {

    const request = await newRequest.save();
    console.log("add new request OK");

    res.status(200).send({
      status: "Done",
      request: newRequest,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getRequestSentByKid = async (req, res, next) => {
  console.log("getRequestSentByKid");

  const kidID = req.body._id;

  try {
    if (!kidID) {
      return res.status(400).send({
        status: "fail",
        message: 'No _id in body',
      });
    }
    request = await Request.find({ sender: kidID })
    if (request == null) {
      return res.status(400).send({
        status: "fail",
        message: 'No request',
      });
    }
    console.log("getRequestSentByKid kidID is: " + kidID)
    res.status(200).send(request);
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });

  }
}

const deleteRequest = async (req, res, next) => {
  console.log("deleteRequest");

  const requestID = req.body._id

  try {
    request = await Request.findById(requestID)

    if (request == null) {
      return res.status(400).send({
        status: "fail",
        message: 'No request',
      });
    }
    await Request.findByIdAndDelete(requestID)
    console.log("deleteRequest deleted " + requestID)
    res.status(200).send({
      message: "Request Deleted",
      request,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });

  }
}

const acceptRequest = async (req, res, next) => {

  console.log("acceptRequest");

  const requestID = req.body._id

  try {
    requests = await Request.findById(requestID)
    child = await Child.findById(requests.sender)

    if (requests == null || child == null) {
      return res.status(400).send({
        status: "fail",
        message: 'No request',
      });
    }
    const newRequest = {
      amount: requests.amount,
      description: requests.message,
    };
    child.transactions.push(newRequest);
    child.balance += requests.amount;

    await child.save();
    await Request.findByIdAndDelete(requestID)

    console.log("acceptRequest  " + requestID)
    res.status(200).send({
      message: "Request Accepted Kid got money + transaction. ",
      requests,
      child,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail Exception",
      message: err.message,
    });

  }
}

module.exports = { addRequest, getRequestSentByKid, deleteRequest, acceptRequest };
