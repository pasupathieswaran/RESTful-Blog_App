var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

mongoose.connect("mongodb://localhost/restful_blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//app setup configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// blog schema configutation
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "test blog",
//   image:
//     "https://www.google.com/search?q=vel+4k+photos&sxsrf=ALeKk00Davavks9KqbcflFrAGi4JMg16eg:1584847384532&tbm=isch&source=iu&ictx=1&fir=8vnPNYAHpZMZWM%253A%252CdzfJlPBS3XWShM%252C_&vet=1&usg=AI4_-kRCsLp5BK0pEI27ScG_CweZOMQu1w&sa=X&ved=2ahUKEwjvhoPLkK3oAhV_wTgGHVdLBSwQ9QEwAHoECAoQFQ#imgrc=8vnPNYAHpZMZWM:",
//   body: "uiyar karunai puriyum vel !!!"
// });

//RESTful ROUTES

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    // we are sending data from blogs  from the DB to the server
    if (err) {
      console.log("error");
    } else {
      res.render("index", { blogs: blogs }); // by rendering it ,we render to index using {blogs:blogs}
    }
  });
});
// new route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});
// new create route
app.post("/blogs", function (req, res) {
  //create blog
  // console.log(req.body);

  // console.log("===========");
  // console.log(req.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("/new");
    } else {
      // redirect to the index page
      res.redirect("/blogs");
    }
  });
});
//show route
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});
// edit route
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});
// update route
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
// delete route
app.delete("/blogs/:id", function (req, res) {
  // destroy blog
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});
//
app.listen(3000, function () {
  console.log("server is running");
});
