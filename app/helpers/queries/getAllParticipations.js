const path = require("path");

const ParticipationApplicationModel = require("../../models/participationApplication");
const ContentModel = require(path.join(process.cwd(), "app/models/content"));

const variables = require("../variables");

module.exports = () => ParticipationApplicationModel.aggregate(
	{ $match: { "meta.deleted": false } },
	{ $group: { _id: "$data.participation", applications: { $push: "$$ROOT" }, count: { $sum: { $ifNull: ["$data.amount", 1] } } } },
	{ $project: { participation: "$_id", applications: 1, count: 1, _id: 0 } }
).exec().then((result) => ContentModel.populate(result, {
	path: "participation",
	match: {
		"meta.deleted": false,
		"meta.published": true,
		"meta.contentType": variables.get().participationId,
	},
}));

