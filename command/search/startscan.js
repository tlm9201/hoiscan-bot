import { SlashCommandBuilder } from 'discord.js';
import scanner from '../../scanner.js';

export default {
    data: new SlashCommandBuilder()
        .setName("startscan")
        .setDescription("Starts a scan for a HOI4 Game.")
        .addStringOption(opt =>
            opt.setName("query")
            .setDescription("The game name query")
            .setRequired(false)),
    async execute(interaction) {
        scanner.startScanning(interaction)
    },
};