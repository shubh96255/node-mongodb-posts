const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const bodyParser = require('body-parser');
const verifyToken = require('../helpers/verifyToken'); 
router.use(verifyToken);

var multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/posts')
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.replace(/([^a-z0-9.]+)/gi, '-');
      cb(null, Date.now() + fileName );
    }
});
var upload = multer({storage: storage});

router.use(bodyParser.json());

// Routes used for Posts module
router.post('/add-post',upload.single('imageFile') ,postController.addPost);
router.get('/get-post',postController.getPost);
router.post('/like-dislike-post',postController.likeDislike);

module.exports = router;