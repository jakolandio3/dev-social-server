import { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as gravatar from 'gravatar';
import { User } from '../../models/User';
import * as bcrypt from 'bcryptjs';
const config = require('config');
const router: Router = express.Router();

//@route POST api/user
//@desc Register User
//@access Public
export interface NewUser extends Request {
	body: {
		name: string;
		email: string;
		password: string;
	};
	user?: any;
}

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req: NewUser, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}
			//generates a gravatar image in the form of a url string
			const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
			user = new User({ name, email, avatar, password });
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw new Error(err.message);
					res.json({ token });
				}
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(error.message);
			}
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
