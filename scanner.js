import { createSearchResultEmbed } from './command/search/search.js'
import { client } from './index.js'
import hoi from './steam/steam_hook.js'

class Scanner {
    constructor() {
        if (Scanner.instance == null) {
            this.queries = new Map()
            this.lobbiesCache = new Map()
            this.scans = new Map()
            Scanner.instance = this
        }
        return Scanner.instance
    }

    async startScanning(interaction) {
        if (this.scans.has(interaction.channel.id)) {
            await interaction.reply({ content: "There is already a scan in this channel. Do `/stopscan` to cancel" })
            return
        }

        await interaction.reply({ content: "✅" })
        this.scans.set(interaction.channel.id, Date.now())
        this.queries.set(interaction.channel.id, interaction.options.getString("query") ?? undefined)
        await this.scan(interaction)

        let now = Date.now()
        let scanResults = this.lobbiesCache.get(interaction.channel.id)

        const channel = await client.channels.fetch(interaction.channel.id)

        while (this.scans.has(interaction.channel.id)) {
            now = Date.now()
            if (now - this.scans.get(interaction.channel.id) > 10000 && scanResults.length !== 0) {
                await this.scan(interaction)
                scanResults = this.lobbiesCache.get(interaction.channel.id)
                if (scanResults !== undefined)
                    channel.send({ embeds: [createSearchResultEmbed(scanResults)] })
                this.scans.set(interaction.channel.id, now)
            }
        }
    }

    async scan(interaction) {
        this.lobbiesCache.set(interaction.channel.id, await hoi.search(this.queries.get(interaction.channel.id)))
    }

    async stopScanning(interaction) {
        if (!this.scans.includes(interaction.channel.id)) {
            await interaction.reply({ content: "There is no ongoing scan in this channel. Do `/startscan` to start" })
            return
        }

        this.scans.delete(interaction.channel.id)
        this.lobbiesCache.delete(interaction.channel.id)
        this.queries.delete(interaction.channel.id)
        await interaction.reply({ content: "✅" })
    }
}

const scanner = new Scanner()
export default scanner