import express from 'express';
const app = express();

import fs from 'fs';
import moment from 'moment-timezone';

// Discord bot
import { Client, Events, GatewayIntentBits,ChannelType } from 'discord.js';

import config from './config.js';
const { token,guildId,parentId } = config;

const discClient = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

discClient.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
discClient.login(token);

const guild = await discClient.guilds.fetch(guildId);
async function createChannel(name) {
	const channel = await guild.channels.create({
		name: name,
		type: ChannelType.GuildText,
		parent: parentId
	});
	console.log(`Channel created: ${channel.name}`);
	return channel;
}
async function checkChannelExists(name) {
	await guild.channels.fetch();

	const existingChannel = guild.channels.cache.find(
		(ch) => ch.name === name.toLowerCase() && ch.type === ChannelType.GuildText
	);
	return existingChannel;
}

// express webhook
app.set('trust proxy',true)
const port = 1095;
app.listen(port,() => {
	console.log(`Server listening on port ${port}`);
});
app.get('/',(req,res) => {
	const reqClient = req.headers['x-origin-client'];

	const id = req.query.id;
	const content = req.query.content;
	const internal = req.query.internal;

	if (id == undefined || content == undefined) {
		console.log('Undefined field');
		return res.status(404).send();
	}

	const type = reqClient ? reqClient:'Browser';

	const ip = req.ip;
	const timestamp = moment().tz('America/Chicago').format();
	// log to file
	fs.appendFile('server.log',`${type} [${timestamp}]-[${ip}]-[${id}]\n${content}\n\n`,error => {
		if (error) {
			throw error;
		}
		console.log(`Logged request from ${ip}`);
	});

	if (!internal) {
		// log to discord
		checkChannelExists(type).then(async channel => {
			if (!channel) {
				channel = await createChannel(type);
			}
			channel.send(`\`${id}\`\n\`\`\`${content}\`\`\``);
		});
	}

	if (!reqClient) {
		return res.status(200).send('<center><h1>404 Not Found</h1></center>');
	}
	return res.status(200).send();
});