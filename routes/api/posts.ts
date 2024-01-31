import { Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import authMiddleware from '../../middleware/auth';
import express from 'express';
import { User } from '../../models/User';
import { Post } from '../../models/Post';

const router: Router = express.Router();

//@route POST api/posts
//@desc Create a post
//@access Private
router.post(
	'/',
	[authMiddleware, check('text', 'Text-field is required').not().isEmpty()],
	async (req: any, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');
			if (user) {
				const newPost = new Post({
					text: req.body.text,
					name: user.name,
					avatar: user.avatar,
					user: req.user.id,
				});

				const post = await newPost.save();
				res.json(post);
			}
		} catch (error) {
			res.status(500).send('Server Error');
		}
	}
);

//@route Get api/posts
//@desc Get all posts
//@access Private

router.get('/', authMiddleware, async (req: any, res: Response) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (error) {
		res.status(500).json({ msg: 'cant find posts Server Error' });
	}
});
//@route Get api/posts/:id
//@desc Get post by id
//@access Private

router.get('/:id', authMiddleware, async (req: any, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.json(post);
	} catch (error: any) {
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).json({ msg: 'Server Error' });
	}
});

//@route DELETE api/posts/:id
//@desc Delete a post
//@access Private

router.delete('/:id', authMiddleware, async (req: any, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		if (post.user?.toString() !== req.user.id.toString()) {
			return res
				.status(401)
				.json({ msg: 'You dont Have permission To delete this Post' });
		}
		await post.deleteOne();

		res.json({ msg: 'post removed' });
	} catch (error: any) {
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).json({ msg: 'cant find posts Server Error' });
		console.log(error);
	}
});

//@route PUT api/posts/like/:id
//@desc like a post and update
//@access Private

router.put('/like/:id', authMiddleware, async (req: any, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post) {
			//chek to see if theres a like in here from current user
			if (
				post.likes.filter((like) => like.user?.toString() === req.user.id)
					.length > 0
			) {
				return res.status(400).json({ msg: 'Post already liked by this user' });
			}
			post.likes.unshift({ user: req.user.id });
			await post.save();
			res.json(post.likes);
		}
	} catch (error) {
		res.status(500).send('Server Error');
	}
});
//@route PUT api/posts/unlike/:id
//@desc unlike a post and update
//@access Private

router.put('/unlike/:id', authMiddleware, async (req: any, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		console.log(post);
		if (!post) return res.send('No likes by this user');
		//chek to see if theres a like in here from current user
		if (
			post.likes.filter((like: any) => like.user?.toString() === req.user.id)
				.length === 0
		) {
			return res.status(400).json({ msg: 'Post isnt liked by this user' });
		}

		const removeIndex = post.likes.map((like: any) =>
			like.user?.toString().indexOf(req.user.id)
		);
		const numberindex = removeIndex[0];

		// );

		// if (typeof removeIndex === 'number') {
		if (numberindex < 0) {
			return res.send('No Likes found on this post by current user');
		}
		// 	}
		// }
		// if (typeof removeIndex === 'number') {
		post.likes.splice(numberindex, 1);
		await post.save();
		res.json(post.likes);
		// }
	} catch (error: any) {
		if (error.kind === 'ObjectId') {
			res.status(404).json({ msg: 'no such post exists' });
		} else res.status(500).send('Server Error');
	}
});

//@route POST api/posts/comment/:id
//@desc Create a comment
//@access Private
router.post(
	'/comment/:id',
	[authMiddleware, check('text', 'Text-field is required').not().isEmpty()],
	async (req: any, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');
			if (user) {
				const post = await Post.findById(req.params.id);

				const newComment = {
					text: req.body.text,
					name: user.name,
					avatar: user.avatar,
					user: req.user.id,
				};

				post?.comments.unshift(newComment);
				post?.save();
				res.json(post?.comments);
			}
		} catch (error) {
			res.status(500).send('Server Error');
		}
	}
);
//@route DELETE api/posts/comment/:id/:comment_id
//@desc DELETE a comment based on id
//@access Private

router.delete(
	'/comment/:id/:comment_id',
	authMiddleware,
	async (req: any, res: Response) => {
		try {
			const post = await Post.findById(req.params.id);
			//comment
			if (post) {
				const comment = post.comments.find(
					(comment) => comment.id === req.params.comment_id
				);
				if (!comment) {
					return res.status(404).json({ msg: 'cant find comment' });
				}
				if (comment.user?.toString() !== req.user.id) {
					return res.status(401).json({ msg: 'User not Authorized' });
				}
				const removeIndex = post.comments.findIndex(
					(comment) => comment._id?.toString() === req.params.comment_id
				);

				post.comments.splice(removeIndex, 1);
				post.save();
				res.json(post.comments);
			}
		} catch (error) {
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
