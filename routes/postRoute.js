const _ = require("lodash");
const axios = require("axios");
const requireTags = require("../middlewares/requireTags");
const validSort = require("../middlewares/validSort");

// simple cache, reference: https://glitch.com/edit/#!/server-side-cache-express?path=server.js%3A25%3A1
var mcache = require("memory-cache");
var cache = (duration) => {
	return (req, res, next) => {
		let key = "__express__" + req.originalUrl || req.url;
		let cachedBody = mcache.get(key);
		if (cachedBody) {
			res.send(cachedBody);
			return;
		} else {
			res.sendResponse = res.send;
			res.send = (body) => {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
};

// route for api/posts
module.exports = (app) => {
	app.get(
		"/api/posts",
		cache(10),
		requireTags,
		validSort,
		async (req, res) => {
			// get the query parameters
			let tags = req.query.tags.split(",");
			let sortBy = req.query.sortBy;
			let direction = req.query.direction;

			// create requests for each tag
			requests = _.map(tags, (tag) => {
				let request = axios.get(
					"https://api.hatchways.io/assessment/blog/posts",
					{
						params: {
							tag,
							sortBy,
							direction,
						},
					}
				);
				return request;
			});

			// create a final list and send get requests concurrently
			var finalList = [];
			await axios
				.all(requests)
				.then(
					axios.spread((...responses) => {
						responses.map((response) => {
							response.data.posts.map((post) => {
								finalList.push(post);
							});
						});
					})
				)
				.catch((errors) => {
					console.log(errors);
				});

			// sort the final list and remove the duplicates
			finalList = _.chain(finalList)
				.uniqBy("id")
				.orderBy(sortBy, direction)
				.value();

			res.status(200).send({ posts: finalList });
		}
	);
};
