const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // Parse JSON request bodies

// Routes used for Posts module
router.post('/add', postController.addPost);


module.exports = router;