import { Response, Router } from 'express';
import authMiddleware from '../../middleware/auth';
import { Profile } from '../../models/Profile';
import { NewUser } from './users';
import { check, validationResult } from 'express-validator';
import { User } from '../../models/User';
const request = require('request');
const express = require('express');
const config = require('config');
const router: Router = express.Router();

//@route GET api/profile/me
//@desc get current users profile
//@access Private
router.get('/me', authMiddleware, async (req: NewUser, res: Response) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
		return res.json(profile);
	} catch (error) {
		res.status(500).send('Server Error');
	}
});

//@route post api/profile
//@desc create or update profile
//@access Private

router.post(
	'/',
	[
		authMiddleware,
		check('status', 'Status is required').not().isEmpty(),
		check('skills', 'Skills is required').not().isEmpty(),
	],

	async (req: any, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;
		//build profile object
		const profileFields: any = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills
				.split(',')
				.map((skill: string) => skill.trim());
		}
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (instagram) profileFields.social.instagram = instagram;
		if (linkedin) profileFields.social.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);
				return res.json(profile);
			}
			//create
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (error) {
			res.status(500).send('Server error');
		}
	}
);
//@route GET api/profile/
//@desc get all profiles
//@access public

router.get('/', async (req: any, res: Response) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (error) {
		res.status(500).send('Server error');
	}
});
//@route GET api/profile/user/:user_id
//@desc get  profile from id
//@access public

router.get('/user/:user_id', async (req: any, res: Response) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);
		if (!profile) return res.status(400).json({ msg: 'Profile not found' });
		res.json(profile);
	} catch (error: any) {
		if (error.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		console.log(error);
		res.status(500).send('Server error');
	}
});

//@route DELETE api/profile
//@desc delete profile, user and posts
//@access Private

router.delete('/', authMiddleware, async (req: any, res: Response) => {
	try {
		//@todo - remove user posts

		//remove profile
		await Profile.findOneAndDelete({ user: req.user.id });
		//remove user
		await User.findOneAndDelete({ _id: req.user.id });
		res.json({ msg: 'user removed' });
	} catch (error) {
		res.status(500).send('Server error');
	}
});

//@route Put api/profile/experience
//@desc add profile experience data
//@access Private

router.put(
	'/experience',
	[
		authMiddleware,
		check('title', 'Title is required').not().isEmpty(),
		check('company', 'Company is required').not().isEmpty(),
		check('from', 'From Date is required').not().isEmpty(),
	],
	async (req: any, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { title, company, location, from, to, current, description } =
			req.body;
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				profile.experience.unshift(newExp);
				await profile.save();
				res.json(profile);
			}
		} catch (error) {
			console.log(error);
			res.status(500).send('Server Error');
		}
	}
);
//@route DELETE api/profile/expereince/:exp_id
//@desc delete users expereince
//@access Private

router.delete(
	'/experience/:exp_id',
	authMiddleware,
	async (req: any, res: Response) => {
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				const removeIndex = profile.experience
					.map((item) => item.id)
					.indexOf(req.params.exp_id);

				if (!removeIndex || removeIndex === -1) return res.send('Id not Valid');
				profile.experience.splice(removeIndex, 1);
				await profile.save();
				res.json(profile);
			}
		} catch (error) {
			res.status(500).send('Server error');
		}
	}
);
//@route Put api/profile/education
//@desc add profile education data
//@access Private

router.put(
	'/education',
	[
		authMiddleware,
		check('school', 'School is required').not().isEmpty(),
		check('degree', 'Degree is required').not().isEmpty(),
		check('from', 'From Date is required').not().isEmpty(),
		check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
	],
	async (req: any, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;
		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				profile.education.unshift(newEdu);
				await profile.save();
				res.json(profile);
			}
		} catch (error) {
			console.log(error);
			res.status(500).send('Server Error');
		}
	}
);
//@route DELETE api/profile/education/:exp_id
//@desc delete users education
//@access Private

router.delete(
	'/education/:edu_id',
	authMiddleware,
	async (req: any, res: Response) => {
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				const removeIndex = profile.education
					.map((item) => item.id)
					.indexOf(req.params.edu_id);

				if (!removeIndex || removeIndex === -1)
					return res.send('Id not Valid(No school matches this)');
				profile.education.splice(removeIndex, 1);
				await profile.save();
				res.json(profile);
			}
		} catch (error) {
			res.status(500).send('Server error');
		}
	}
);

//@route GET api/profile/github/:username
//@desc Get user repos from github
//@access Public

router.get('/github/:username', (req: any, res: Response) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'gitHubClientID'
			)}&client_secret=${config.get('gitHubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);
			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No GitHub Profile found' });
			}
			res.json(JSON.parse(body));
		});
	} catch (error) {
		res.status(500).send('Server error');
	}
});

module.exports = router;
