const Posts = require("../models/posts");

const Blog = {
	getAll: function() {
		return Posts.findAll();
	},

	add: function(title, comment, image) {
		return Posts.create({
			title: title,
		    comment: comment,
		    image: image
			});

	},

	search: function(search) {
		return Posts.findAll ({
			where: {
				title: {
					$like: "%" + search + "%"
				},
			},
		});
	},
};

module.exports = Blog;
