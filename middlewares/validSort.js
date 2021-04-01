const sortbyFields = ["id", "reads", "likes", "popularity"];
const directionFields = ["desc", "asc"];

module.exports = (req, res, next) => {
	if (!sortbyFields.includes(req.query.sortBy)) {
		return res.status(400).send({ error: "sortBy parameter is invalid" });
	}
	if (!directionFields.includes(req.query.direction)) {
		return res
			.status(400)
			.send({ error: "direction parameter is invalid" });
	}
	next();
};
