Object.defineProperty(exports, '__esModule', { value: true });
var cors_1 = require('cors');
var connnectDB = require('./config/db');
var express = require('express');
var app = express();
//connect DB
connnectDB();
app.get('/', function (req, res) {
	return res.send('API Running');
});
//middleware
app.use(express.json({ extended: false }));
app.use((0, cors_1)());
//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
	return console.log('Server listening on port '.concat(PORT));
});
