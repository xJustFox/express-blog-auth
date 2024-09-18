const posts = require('../controllers/posts.js');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const uploader = multer({ dest: 'public' });

const findPost = require('../middlewares/findPost.js');

router.get('/', posts.index);
router.post('/store', uploader.single('img'), posts.store);
router.get('/:slug', posts.show);
router.get('/:slug/download', posts.downloadImage);
router.delete('/:slug', findPost, posts.destroy);

module.exports = router;