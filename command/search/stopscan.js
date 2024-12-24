import { SlashCommandBuilder } from 'discord.js';
import scanner from '../../scanner.js';

export default {
    data: new SlashCommandBuilder()
        .setName("stopscan")
        .setDescription("Stops a scan for a HOI4 Game."),
    async execute(interaction) {
        scanner.stopScanning(interaction)
    },
};