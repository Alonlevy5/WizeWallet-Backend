const Parent = require("../models/parent_model");
const Child = require("../models/child_model");

const getKids = async (req, res, next) => {

    console.log("getKids For the specific Parent");
    const loggedParent = req.user._id;

    try {
      parent = await Parent.findById(loggedParent);
      return res.status(200).send({
          message: 'Those are the kids linked to your account',
          kidID: parent.children,
      });
    } catch (err) {
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
    }
  };

  const addKids = async (req, res, next) => {

    console.log("addKids For the specific Parent");
    const childID = req.body.id;
    const loggedParent = req.user._id;

    try {
      parent = await Parent.findById(loggedParent);
      if (parent.children.includes(childID)){
          return res.status(401).send({
              status: 'fail',
              message: 'kid already registered',
          })
      }
      parent.children.push(childID);
      await parent.save()
      res.status(200).send({
          message: "The Following kid was added",
          kidID: parent.children,
      });
    } catch (err) {
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
    }
  };

  module.exports = {getKids, addKids}