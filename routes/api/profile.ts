import { Request, Response, Router } from 'express';

const express = require('express');
const router: Router = express.Router();

//@route GET api/profile
//@desc Test route
//@access Public
router.get('/', (req: Request, res: Response) => res.send('Profile route'));

module.exports = router;
