const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  authHeader = req.headers["authorization"];
  //in postman header key=authorization, value=authorization token 
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send(err.message);
    req.user = user;
    next();
  });
};

module.exports = authenticate;
