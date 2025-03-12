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
	const client = req.headers['x-origin-client'];

	const id = req.query.id;
	const content = req.query.content;

	if (id == undefined || content == undefined) {
		console.log('Undefined field');
		return res.status(404).send();
	}

	const type = client ? client:'Browser';

	const ip = req.ip;
	const timestamp = moment().tz('America/Chicago').format();
	fs.appendFile('server.log',`${type} [${timestamp}]-[${ip}]-[${id}]\n${content}\n`,error => {
		if (error) {
			throw error;
		}
		console.log(`Logged request from ${ip}`);
	});


	if (!client) {
		return res.status(200).send('<center><h1>404 Not Found</h1></center>');
	}
	return res.status(200).send();
})