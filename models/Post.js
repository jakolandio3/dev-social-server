Object.defineProperty(exports, '__esModule', { value: true });
exports.Post = void 0;
var mongoose_1 = require('mongoose');
var Schema = mongoose_1.default.Schema;
var PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
		},
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});
var Post = mongoose_1.default.model('post', PostSchema);
exports.Post = Post;
