import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'node:url';

// env
import dotenv from 'dotenv';
dotenv.config()
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, 'command');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	// Add the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(filePath);
		if ('data' in command.default && 'execute' in command.default) {
			commands.push(command.default.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST({ version: '10' }).setToken(token);

// Deploy commands globally
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} global application (/) commands.`);

        // deploy globally
		const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });

		console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
	} catch (error) {
		// Catch and log any errors
		console.error(error);
	}
})();
