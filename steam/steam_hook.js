import steamworks from 'steamworks.js';

class Hoi {
    constructor() {
        this.client = steamworks.init(394360)
    }

    async search(query) {
        const foundLobbies = []
        const lobbies = await this.client.matchmaking.getLobbies() 
        
        if (query === undefined) {
            lobbies.forEach((lobby) => {
                const data = lobby.getFullData()
                foundLobbies.push(data) // add
            })
        } else {
            lobbies.forEach((lobby) => {
                const data = lobby.getFullData()
    
                // check if this lobby matches the search
                if (dataMatchesSearch(query, data))
                    foundLobbies.push(data) // add
            })
        }

        return foundLobbies 
    }
}

function dataMatchesSearch(query, data) {
    return data.name.toLowerCase().includes(query.toLowerCase())
}

const hoi = new Hoi()
export default hoi
