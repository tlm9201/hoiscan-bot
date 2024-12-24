import steamworks from 'steamworks.js';

class Hoi {
    constructor() {
        this.client = steamworks.init(394360)
    }

    async search(query) {
        return (await this.client.matchmaking.getLobbies()).map((lobby) => lobby.getFullData()).filter((lobby) => lobby.password === '0' && lobby.status.includes('STARTING') && lobby.version.includes('(0143)') && (query === undefined || lobby.name.toLowerCase().includes(query.toLowerCase())))
    }
}

const hoi = new Hoi()
export default hoi
