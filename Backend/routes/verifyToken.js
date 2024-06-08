const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.json({ valid: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ valid: false });
    } else {
      return res.json({ valid: true });
    }
  });
});

module.exports = router;
