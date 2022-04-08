const User = require("../models/user_model");
const bcrypt = require("bcrypt"); // for encryption
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  console.log("register");

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  if (userEmail == null || userPassword == null) {
    return sendError(res, "wrong eamil or password");
  }

  try {
    const exists = await User.findOne({ email: userEmail });
    if (exists != null) {
      return sendError(res, "user already exists");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(userPassword, salt);

      const user = User({
        email: userEmail,
        password: hashPassword,
      });

      newUser = await user.save();
      res.status(200).send(newUser);
    }
  } catch (err) {
    sendError(res, `cannot find user by email: ${userEmail}`);
  }
};

const login = async (req, res, next) => {
  console.log("Login");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return sendError(res, "wrong eamil or password");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user == null) return sendError(res, "bad email");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, "wrong email or password");

    //send token to user
    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    res.status(200).send({ accessToken: accessToken });
  } catch (err) {
    return sendError(res, err.message);
  }
};

const logout = async (req, res, next) => {
  console.log("login");
  res.status(400).send({
    status: "fail",
    message: "not implemented",
  });
};

function sendError(res, msg) {
  return res.status(400).send({
    status: "fail",
    message: msg,
  });
}

module.exports = {
  login,
  register,
  logout,
};
