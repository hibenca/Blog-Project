// Required dependencies
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');


// Mongoose Server
// MongoAtlas information: "mongodb+srv://admin-corey:<password>@cluster0-xtejg.mongodb.net/BlogPostsDB"
mongoose.connect('mongodb://localhost:27017/BlogPostsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Mongoose schema
const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

// Mongoose model
const Post = mongoose.model('Post', postSchema);

// Page content
const homeContent = "This is the stuff that is written on the home page";
const aboutContent = "I'm a super cool guy";
const contactContent = "Reach me at supercoolguy@gmail.com";

const posts = [];

// Express app
const app = express();

// EJS setup
app.set('view engine', 'ejs');

// bodyParser setup
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Home page
app.get("/", function(req, res) {

  Post.find({}, function(err, foundContent) {
    res.render("home.ejs", {
      homeContent: homeContent,
      posts: foundContent
    });
  })
});

// About page
app.get("/about", function(req, res) {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

// Contact page
app.get("/contact", function(req, res) {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

// New posts
app.get("/post/:postId", function(req, res) {
  const requestedPostId = _.capitalize(req.params.postId);

  Post.findOne({ _id: requestedPostId }, function(err, foundContent) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("post.ejs", {
        title: foundContent.title,
        content: foundContent.content
      });
    }
  });
});

// Compose get page
app.get("/compose", function(req, res) {
  res.render("compose.ejs");
});

// Compose post page
app.post("/compose", function(req, res) {
  const post = new Post ({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postContent
  });

  post.save(function(err) {
    if (!err){
      res.redirect("/");
    }
  });
});

// Listening for start of server
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
