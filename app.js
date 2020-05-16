const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const _ = require('lodash');

const homeContent = "This is the stuff that is written on the home page";
const aboutContent = "I'm a super cool guy";
const contactContent = "Reach me at supercoolguy@gmail.com";

const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {

  res.render("home.ejs", {homeContent: homeContent, posts: posts});
});

app.get("/about", function (req, res) {
  res.render("about.ejs", {aboutContent: aboutContent});
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs", {contactContent: contactContent});
});

app.get("/post/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post.ejs", {title: post.title, content: post.content});
    }
  });
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent
  };
  posts.push(post);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
