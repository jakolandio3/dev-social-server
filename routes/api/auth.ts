import { Response, Router } from 'express';
import authMiddleware from '../../middleware/auth';
import { User } from '../../models/User';
import { NewUser } from './users';
import { check, validationResult } from 'express-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const express = require('express');
const config = require('config');
const router: Router = express.Router();

//@route GET api/auth
//@desc Test route
//@access Private
router.get('/', authMiddleware, async (req: NewUser, res: Response) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		res.status(500).send('Server error');
	}
});
//@route post api/auth
//@desc authenticate user and get token
//@access public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req: NewUser, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}
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
