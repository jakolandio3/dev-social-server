var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, '__esModule', { value: true });
var express_validator_1 = require('express-validator');
var auth_1 = require('../../middleware/auth');
var express_1 = require('express');
var User_1 = require('../../models/User');
var Post_1 = require('../../models/Post');
var router = express_1.Router();
//@route POST api/posts
//@desc Create a post
//@access Private
router.post(
	'/',
	[
		auth_1.default,
		(0, express_validator_1.check)('text', 'Text-field is required')
			.not()
			.isEmpty(),
	],
	function (req, res) {
		return __awaiter(void 0, void 0, void 0, function () {
			var errors, user, newPost, post, error_1;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						errors = (0, express_validator_1.validationResult)(req);
						if (!errors.isEmpty()) {
							return [
								2 /*return*/,
								res.status(400).json({ errors: errors.array() }),
							];
						}
						_a.label = 1;
					case 1:
						_a.trys.push([1, 5, , 6]);
						return [
							4 /*yield*/,
							User_1.User.findById(req.user.id).select('-password'),
						];
					case 2:
						user = _a.sent();
						if (!user) return [3 /*break*/, 4];
						newPost = new Post_1.Post({
							text: req.body.text,
							name: user.name,
							avatar: user.avatar,
							user: req.user.id,
						});
						return [4 /*yield*/, newPost.save()];
					case 3:
						post = _a.sent();
						res.json(post);
						_a.label = 4;
					case 4:
						return [3 /*break*/, 6];
					case 5:
						error_1 = _a.sent();
						res.status(500).send('Server Error');
						return [3 /*break*/, 6];
					case 6:
						return [2 /*return*/];
				}
			});
		});
	}
);
//@route Get api/posts
//@desc Get all posts
//@access Private
router.get('/', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var posts, error_2;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [4 /*yield*/, Post_1.Post.find().sort({ date: -1 })];
				case 1:
					posts = _a.sent();
					res.json(posts);
					return [3 /*break*/, 3];
				case 2:
					error_2 = _a.sent();
					res.status(500).json({ msg: 'cant find posts Server Error' });
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
});
//@route Get api/posts/:id
//@desc Get post by id
//@access Private
router.get('/:id', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var post, error_3;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
				case 1:
					post = _a.sent();
					if (!post) {
						return [
							2 /*return*/,
							res.status(404).json({ msg: 'Post not found' }),
						];
					}
					res.json(post);
					return [3 /*break*/, 3];
				case 2:
					error_3 = _a.sent();
					if (error_3.kind === 'ObjectId') {
						return [
							2 /*return*/,
							res.status(404).json({ msg: 'Post not found' }),
						];
					}
					res.status(500).json({ msg: 'Server Error' });
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
});
//@route DELETE api/posts/:id
//@desc Delete a post
//@access Private
router.delete('/:id', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var post, error_4;
		var _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 3, , 4]);
					return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
				case 1:
					post = _b.sent();
					if (!post) {
						return [
							2 /*return*/,
							res.status(404).json({ msg: 'Post not found' }),
						];
					}
					if (
						((_a = post.user) === null || _a === void 0
							? void 0
							: _a.toString()) !== req.user.id.toString()
					) {
						return [
							2 /*return*/,
							res
								.status(401)
								.json({ msg: 'You dont Have permission To delete this Post' }),
						];
					}
					return [4 /*yield*/, post.deleteOne()];
				case 2:
					_b.sent();
					res.json({ msg: 'post removed' });
					return [3 /*break*/, 4];
				case 3:
					error_4 = _b.sent();
					if (error_4.kind === 'ObjectId') {
						return [
							2 /*return*/,
							res.status(404).json({ msg: 'Post not found' }),
						];
					}
					res.status(500).json({ msg: 'cant find posts Server Error' });
					console.log(error_4);
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
});
//@route PUT api/posts/like/:id
//@desc like a post and update
//@access Private
router.put('/like/:id', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var post, error_5;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 4, , 5]);
					return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
				case 1:
					post = _a.sent();
					if (!post) return [3 /*break*/, 3];
					//chek to see if theres a like in here from current user
					if (
						post.likes.filter(function (like) {
							var _a;
							return (
								((_a = like.user) === null || _a === void 0
									? void 0
									: _a.toString()) === req.user.id
							);
						}).length > 0
					) {
						return [
							2 /*return*/,
							res.status(400).json({ msg: 'Post already liked by this user' }),
						];
					}
					post.likes.unshift({ user: req.user.id });
					return [4 /*yield*/, post.save()];
				case 2:
					_a.sent();
					res.json(post.likes);
					_a.label = 3;
				case 3:
					return [3 /*break*/, 5];
				case 4:
					error_5 = _a.sent();
					res.status(500).send('Server Error');
					return [3 /*break*/, 5];
				case 5:
					return [2 /*return*/];
			}
		});
	});
});
//@route PUT api/posts/unlike/:id
//@desc unlike a post and update
//@access Private
router.put('/unlike/:id', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var post, removeIndex, numberindex, error_6;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 3, , 4]);
					return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
				case 1:
					post = _a.sent();
					console.log(post);
					if (!post) return [2 /*return*/, res.send('No likes by this user')];
					//chek to see if theres a like in here from current user
					if (
						post.likes.filter(function (like) {
							var _a;
							return (
								((_a = like.user) === null || _a === void 0
									? void 0
									: _a.toString()) === req.user.id
							);
						}).length === 0
					) {
						return [
							2 /*return*/,
							res.status(400).json({ msg: 'Post isnt liked by this user' }),
						];
					}
					removeIndex = post.likes.map(function (like) {
						var _a;
						return (_a = like.user) === null || _a === void 0
							? void 0
							: _a.toString().indexOf(req.user.id);
					});
					numberindex = removeIndex[0];
					// );
					// if (typeof removeIndex === 'number') {
					if (numberindex < 0) {
						return [
							2 /*return*/,
							res.send('No Likes found on this post by current user'),
						];
					}
					// 	}
					// }
					// if (typeof removeIndex === 'number') {
					post.likes.splice(numberindex, 1);
					return [4 /*yield*/, post.save()];
				case 2:
					_a.sent();
					res.json(post.likes);
					return [3 /*break*/, 4];
				case 3:
					error_6 = _a.sent();
					if (error_6.kind === 'ObjectId') {
						res.status(404).json({ msg: 'no such post exists' });
					} else res.status(500).send('Server Error');
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
});
//@route POST api/posts/comment/:id
//@desc Create a comment
//@access Private
router.post(
	'/comment/:id',
	[
		auth_1.default,
		(0, express_validator_1.check)('text', 'Text-field is required')
			.not()
			.isEmpty(),
	],
	function (req, res) {
		return __awaiter(void 0, void 0, void 0, function () {
			var errors, user, post, newComment, error_7;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						errors = (0, express_validator_1.validationResult)(req);
						if (!errors.isEmpty()) {
							return [
								2 /*return*/,
								res.status(400).json({ errors: errors.array() }),
							];
						}
						_a.label = 1;
					case 1:
						_a.trys.push([1, 5, , 6]);
						return [
							4 /*yield*/,
							User_1.User.findById(req.user.id).select('-password'),
						];
					case 2:
						user = _a.sent();
						if (!user) return [3 /*break*/, 4];
						return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
					case 3:
						post = _a.sent();
						newComment = {
							text: req.body.text,
							name: user.name,
							avatar: user.avatar,
							user: req.user.id,
						};
						post === null || post === void 0
							? void 0
							: post.comments.unshift(newComment);
						post === null || post === void 0 ? void 0 : post.save();
						res.json(post === null || post === void 0 ? void 0 : post.comments);
						_a.label = 4;
					case 4:
						return [3 /*break*/, 6];
					case 5:
						error_7 = _a.sent();
						res.status(500).send('Server Error');
						return [3 /*break*/, 6];
					case 6:
						return [2 /*return*/];
				}
			});
		});
	}
);
//@route DELETE api/posts/comment/:id/:comment_id
//@desc DELETE a comment based on id
//@access Private
router.delete('/comment/:id/:comment_id', auth_1.default, function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var post, comment, removeIndex, error_8;
		var _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 2, , 3]);
					return [4 /*yield*/, Post_1.Post.findById(req.params.id)];
				case 1:
					post = _b.sent();
					//comment
					if (post) {
						comment = post.comments.find(function (comment) {
							return comment.id === req.params.comment_id;
						});
						if (!comment) {
							return [
								2 /*return*/,
								res.status(404).json({ msg: 'cant find comment' }),
							];
						}
						if (
							((_a = comment.user) === null || _a === void 0
								? void 0
								: _a.toString()) !== req.user.id
						) {
							return [
								2 /*return*/,
								res.status(401).json({ msg: 'User not Authorized' }),
							];
						}
						removeIndex = post.comments.findIndex(function (comment) {
							var _a;
							return (
								((_a = comment._id) === null || _a === void 0
									? void 0
									: _a.toString()) === req.params.comment_id
							);
						});
						post.comments.splice(removeIndex, 1);
						post.save();
						res.json(post.comments);
					}
					return [3 /*break*/, 3];
				case 2:
					error_8 = _b.sent();
					res.status(500).send('Server Error');
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
});
module.exports = router;
