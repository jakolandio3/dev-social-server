import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { NewUser } from '../routes/api/users';

const config = require('config');

export default function authMiddleware(
	req: NewUser,
	res: Response,
	next: NextFunction
) {
	//get token from header
	const token = req.header('x-auth-token');

	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	//verify token
	try {
		const decoded: JwtPayload | string = jwt.verify(
			token,
			config.get('jwtSecret')
		);
		if (typeof decoded === 'string') {
			return;
		} else req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
}
