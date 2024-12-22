import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import hoi from '../../steam/steam_hook.js'

function createSearchResultEmbed(data) {
    const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("HOI4 Games")
                .setTimestamp();

    
    data.forEach(element => {
        // we need to trim to 25 length bc discord embed field name max length
        var name = element.name
        console.log(name)
        if (name.length > 25)
            name = name.substring(0, 22) + "..."
        embed.addFields({ name: `${name}`, value: `${element.__gameserverSteamID}`, inline: true })
    });

    return embed
}

export default {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Searches for a HOI game.")
        .addStringOption(opt =>
            opt.setName("query")
            .setDescription("The game name query")
            .setRequired(false)),
    async execute(interaction) {
        const query = interaction.options.getString("query") ?? undefined;

        const responseData = await hoi.search(query)
        if (responseData.length == 0)
            await interaction.reply("No lobbies could be found!")
        else {
            const responseEmbed = createSearchResultEmbed(responseData)
            await interaction.reply({ embeds: [responseEmbed] })
        }
    },
};