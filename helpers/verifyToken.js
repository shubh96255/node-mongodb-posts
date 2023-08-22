const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const secretKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  // token is sent in the 'Authorization' key in header
  const token = req.headers.authorization; 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        req.user.userId = new mongoose.Types.ObjectId(req.user.userId);
        next();
    });
}

module.exports = verifyToken;
