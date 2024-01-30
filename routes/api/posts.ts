import { Request, Response, Router } from 'express';

const express = require('express');
const router: Router = express.Router();

//@route GET api/posts
//@desc Test route
//@access Public
router.get('/', (req: Request, res: Response) => res.send('Posts route'));
module.exports = router;
