module.exports = (req, res, next) => {
	if (!req.query.tags) {
		return res.status(400).send({ error: "Tags parameter is required" });
	}
	next();
};
