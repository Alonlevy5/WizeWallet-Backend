const Parent = require("../models/parent_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Child = require("../models/child_model");

function sendError(res, code, msg) {
  return res.status(code).send({
    status: "fail",
    eror: msg,
  });
}

const register = async (req, res, next) => {
  console.log("Register");

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  if (userEmail == null || userPassword == null) {
    return sendError(res, 400, "Wrong email or password");
  }

  try {
    if (req.body.balance == "" || req.body.balance) {
      const name = req.body.name;
      const balance = req.body.balance;
      const id = req.body._id;
      const exists = await Child.findOne({ email: userEmail });
      const exists1 = await Parent.findOne({ email: userEmail });
      if (exists != null || exists1 != null) {
        return sendError(res, 400, "User already exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userPassword, salt);

        const user = Child({
          _id: id,
          name: name,
          email: userEmail,
          password: hashPassword,
          balance: balance,
        });

        newUser = await user.save();
        console.log("register Child OK");
        res.status(200).send(newUser);
      }
    } else {
      const exists = await Parent.findOne({ email: userEmail });
      const exists1 = await Child.findOne({ email: userEmail });
      if (exists != null || exists1 != null) {
        return sendError(res, 400, "Parent User already exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userPassword, salt);

        const user = Parent({
          email: userEmail,
          password: hashPassword,
        });

        newUser = await user.save();
        console.log("register Parent OK");
        res.status(200).send(newUser);
      }
    }
  } catch (err) {
    sendError(
      res,
      400,
      `User id is Registered already on a diffrent Email than: ${userEmail} or your missing some Required Fields`
    );
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
    const parent = await Parent.findOne({ email: email });
    const child = await Child.findOne({ email: email });
    if (parent == null && child == null)
      return sendError(res, 400, "Wrong email or password");
    if (parent) {
      const match = await bcrypt.compare(password, parent.password);
      if (!match) return sendError(res, 400, "Wrong email or password");

      //send token to user
      const accessToken = await jwt.sign(
        { _id: parent._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
      );

      const refreshToken = await jwt.sign(
        { _id: parent._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      if (parent.tokens == null) parent.tokens = [refreshToken];
      else parent.tokens.push(refreshToken);
      await parent.save();

      console.log("login Parent OK");
      res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      const match = await bcrypt.compare(password, child.password);
      if (!match) return sendError(res, 400, "Wrong email or password");

      //send token to user
      const accessToken = await jwt.sign(
        { _id: child._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
      );

      const refreshToken = await jwt.sign(
        { _id: child._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      if (child.tokens == null) child.tokens = [refreshToken];
      else child.tokens.push(refreshToken);
      await child.save();

      console.log("login Child OK");
      res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (err) {
    return sendError(res, 400, err.message);
  }
};

const refreshToken = async (req, res, next) => {
  //Need to give refreshToken to get new AccessToken
  console.log("refreshToken");
  authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) return res.sendStatus("401");

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).send(err.message);
    const userId = userInfo._id;
    if (typeof userId === "number") {
      try {
        child = await Child.findById(userId);
        if (child == null) return res.status(403).send("Invalid request");
        if (!child.tokens.includes(token)) {
          child.tokens = [];
          await child.save();
          return res.status(403).send("Invalid request/Cleared all Tokens");
        }
        const accessToken = await jwt.sign(
          { _id: child._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );
        const refreshToken = await jwt.sign(
          { _id: child._id },
          process.env.REFRESH_TOKEN_SECRET
        );

        child.tokens[child.tokens.indexOf(token)] = refreshToken;
        await child.save();
        res
          .status(200)
          .send({ accessToken: accessToken, refreshToken: refreshToken });
      } catch (err) {
        res.status(403).send(err.message);
      }
    } else {
      try {
        parent = await Parent.findById(userId);
        if (parent == null) return res.status(403).send("Invalid request");
        if (!parent.tokens.includes(token)) {
          parent.tokens = [];
          await parent.save();
          return res.status(403).send("Invalid request/Cleared all Tokens");
        }
        const accessToken = await jwt.sign(
          { _id: parent._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );
        const refreshToken = await jwt.sign(
          { _id: parent._id },
          process.env.REFRESH_TOKEN_SECRET
        );

        parent.tokens[parent.tokens.indexOf(token)] = refreshToken;
        await parent.save();
        res
          .status(200)
          .send({ accessToken: accessToken, refreshToken: refreshToken });
      } catch (err) {
        res.status(403).send(err.message);
      }
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

    if (typeof userId === "number") {
      try {
        const child = await Child.findById(userId);
        if (child == null) return res.status(403).send("No Child found");
        if (!child.tokens.includes(token)) {
          child.tokens = [];
          await child.save();
          return res.status(403).send("Invalid request/Cleared all Tokens");
        }
        child.tokens.splice(child.tokens.indexOf(token), 1);
        await child.save();
        console.log("logout Child OK");
        res.status(200).send("You logged out!");
      } catch (err) {
        res.status(403).send(err.message);
      }
    } else {
      try {
        const parent = await Parent.findById(userId);
        if (parent == null) return res.status(403).send("No Parent found");
        if (!parent.tokens.includes(token)) {
          parent.tokens = [];
          await parent.save();
          return res.status(403).send("Invalid request/Cleared all Tokens");
        }
        parent.tokens.splice(parent.tokens.indexOf(token), 1);
        await parent.save();
        console.log("logout Parent OK");
        res.status(200).send("You logged out!");
      } catch (err) {
        res.status(403).send(err.message);
      }
    }
  });
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
};
