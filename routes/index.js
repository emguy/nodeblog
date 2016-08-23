import express from 'express';
import monk from 'monk';

//let db = monk('127.0.0.1/nodeblog', {username: 'emguy', password: '31419'});

var db = require('monk')('emguy:314159@localhost:27017/nodeblog');

//let db = monk('emguy:314159@localhost/nodeblog');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  let db = req.db;
  let posts = db.get('posts');
  posts.find({}, {}, (err, posts) => {
    console.log(err);
    console.log(posts);
    res.render('index', { posts: posts });
  });
});

export { router as default };

