const express = require('express');
const app = express();

const fs = require('fs');

const moment = require('moment-timezone');

app.set('trust proxy',true)
const port = 1095;
app.listen(port,() => {
	console.log(`Server listening on port ${port}`);
});
app.get('/',(req,res) => {
	const id = req.query.id;
	const content = req.body;
	const ip = req.ip;
	const timestamp = moment().tz('America/Chicago').format();
	fs.appendFile('server.log',`[${timestamp}]-[${ip}]-[${id}]\n${content}\n`,error => {
		if (error) {
			throw error;
		}
		console.log(`Logged request from ${ip}`);
	});
	return res.status(404).send('Not found');
});