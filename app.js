require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pwFormMW = require("./middleware/pwform");
const Blog = require("./util/blog");
const fs = require('fs');
const path = require("path");
const posts = require("./models/posts");
const sql = require("./util/sql");
const multer = require("multer");
const uploader = multer({
	dest: "uploads/"
});

const renderTemplate = require("./util/renderTemplate");

const app = express();
const cookieSecret = process.env.COOKIE_SECRET || "dev";


// *** Configuration *** //
app.set("view engine", "ejs");
app.use(express.static("uploads"));
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser(cookieSecret));
app.use(session({resave: true,
	saveUnitialized: true,
	secret: cookieSecret
}));


// *** Routes *** //
app.get("/", function(req, res) {
	renderTemplate(res, "Welcome", "home");
});


app.get("/posts", pwFormMW(process.env.PASSWORD), function(req, res) {
	renderTemplate(res, "Posts", "posts");

});

app.post("/posts", uploader.single("file"), function(req, res) {
	console.log(req.body.title, req.body.comment, req.file)
	fs.renameSync(req.file.path, req.file.destination + req.file.filename)
	Blog.add(req.body.title, req.body.comment, req.file.filename)
	.then(function(title, comment, image) {
		// fs.readdir("./assets/images", function(err, images) {
	res.redirect("/destinations");
   })
	.catch(function(err) {
		res.status(403);
 	    res.render("/");
  	})
});


app.get("/destinations", function(req, res) {
	Blog.getAll()
		.then(function(blog, body) {
			renderTemplate(res, "Destinations", "destinations", {
				blog: blog,

			});
		});
});


app.get("/search", function(req, res) {
	console.log(req.query.search)

	Blog.search(req.query.search).then(function(title, comment, images) {
		  renderTemplate(res, "Search","search", {
			title: title,
			comment: comment,
			images: images,
			message: "Showing results for '" + req.query.search + "'",
		})
	.catch(function(err) {
		res.status(401);
 	    res.render("/");
  	});
	});
});

// app.get("/destinations", function(req, res) {
// 	fs.readdir("./assets/images", function(err, images) {
// 		console.log("IMAGES>>>>>>>>>>>>>>>>>>>>>>>", images);
// 		if (err)
// 			console.log(images);

// 		// res.json(images)
// 		renderTemplate(res, "Destinations", "destinations", {

// 			images: images,
// 			message: "Welcome to my Blog",
// 		});
// 		console.log(req.body.title);
// 	});
// });
app.get("*", function(req, res) {
res.status(404);
res.render("page404");
});


// *** Startup *** //
sql.sync().then(function() {
	console.log("Database sync'd");
	const port = process.env.PORT || 3001;
	app.listen(port, function() {
		console.log("App is available at http://localhost:" + port);
	});
});
