import { Request, Response } from 'express';
import cors from 'cors';
const connnectDB = require('./config/db');
const express = require('express');

const app = express();
//connect DB
connnectDB();
app.get('/', (req: Request, res: Response) => res.send('API Running'));

//middleware
app.use(express.json({ extended: false }));
app.use(cors());
//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
