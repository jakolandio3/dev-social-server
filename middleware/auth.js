Object.defineProperty(exports, '__esModule', { value: true });
var jwt = require('jsonwebtoken');
var config = require('config');
function authMiddleware(req, res, next) {
	//get token from header
	var token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}
	//verify token
	try {
		var decoded = jwt.verify(token, config.get('jwtSecret'));
		if (typeof decoded === 'string') {
			return;
		} else req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
}
exports.default = authMiddleware;
