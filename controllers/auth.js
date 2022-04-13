const User = require("../models/user_model");
const bcrypt = require("bcrypt"); // for encryption
const jwt = require("jsonwebtoken");

function sendError(res, code, msg) {
  return res.status(code).send({
    status: "fail",
    eror: msg,
  });
}

const register = async (req, res, next) => {
  console.log("register");

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  if (userEmail == null || userPassword == null) {
    return sendError(res, 400, "wrong eamil or password");
  }

  try {
    const exists = await User.findOne({ email: userEmail });
    if (exists != null) {
      return sendError(res, 400, "user already exists");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(userPassword, salt);

      const user = User({
        email: userEmail,
        password: hashPassword,
      });

      newUser = await user.save();
      console.log('register OK');
      res.status(200).send(newUser);
    }
  } catch (err) {
    sendError(res, 400, `cannot find user by email: ${userEmail}`);
  }
};

const login = async (req, res, next) => {
  console.log("Login");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return sendError(res, 400, "Wrong eamil or password");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user == null) return sendError(res, 400, "Wrong email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, 400, "Wrong email or password");

    //send token to user
    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    const refreshToken = await jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    if (user.tokens == null) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);
    await user.save();

    console.log('login OK');
    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return sendError(res, 400, err.message);
  }
};

const refreshToken = async (req, res, next) => {
  console.log("refreshToken");
  authHeaders = req.headers["authorization"]; 
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) return res.sendStatus("401");

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).send(err.message);
    const userId = userInfo._id;
    try {
      user = await User.findById(userId);
      if (user == null) return res.status(403).send("Invalid request");
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        return res.status(403).send("Invalid request");
      }
      const accessToken = await jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
      );
      const refreshToken = await jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      user.tokens[user.tokens.indexOf(token)] = refreshToken;
      await user.save();
      res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (err) {
      res.status(403).send(err.message);
    }
  });
};

const logout = async (req, res, next) => {
  console.log("Logout");
  //need to give here the refresh  token
  authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) return res.sendStatus("401");

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).send(err.message);
    const userId = userInfo._id;
    try {
      user = await User.findById(userId);
      if (user == null) return res.status(403).send("Invalid request");
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        return res.status(403).send("Invalid request");
      }
      user.tokens.splice(user.tokens.indexOf(token), 1);
      await user.save();
      console.log('logout OK');
      res.status(200).send('You loged out!');
    } catch (err) {
      res.status(403).send(err.message);
    }
  });
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
};
