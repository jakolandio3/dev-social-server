Object.defineProperty(exports, '__esModule', { value: true });
exports.Profile = void 0;
var mongoose_1 = require('mongoose');
var profileSchema = new mongoose_1.default.Schema({
	user: {
		type: mongoose_1.default.Schema.Types.ObjectId,
		ref: 'user',
	},
	company: {
		type: String,
	},
	website: {
		type: String,
	},
	location: {
		type: String,
	},
	status: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
		required: true,
	},
	bio: {
		type: String,
	},
	githubusername: {
		type: String,
	},
	experience: [
		{
			title: {
				type: String,
				required: true,
			},
			company: {
				type: String,
				required: true,
			},
			location: {
				type: String,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
			},
			current: {
				type: Boolean,
				default: false,
			},
			description: {
				type: String,
			},
		},
	],
	education: [
		{
			school: {
				type: String,
				required: true,
			},
			degree: {
				type: String,
				required: true,
			},
			fieldofstudy: {
				type: String,
				required: true,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
			},
			current: {
				type: Boolean,
				default: false,
			},
			description: {
				type: String,
			},
		},
	],
	social: {
		youtube: {
			type: String,
		},
		twitter: {
			type: String,
		},
		facebook: {
			type: String,
		},
		linkedin: {
			type: String,
		},
		instagram: {
			type: String,
		},
		website: {
			type: String,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
var Profile = mongoose_1.default.model('profile', profileSchema);
exports.Profile = Profile;
