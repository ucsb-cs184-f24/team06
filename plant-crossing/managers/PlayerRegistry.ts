import Player from '../data-structures/Player';

class PlayerRegistry {
    private static instance: PlayerRegistry;
    private players: Map<string, Player>;

    private constructor() {
        this.players = new Map();
    }

    public static getInstance(): PlayerRegistry {
        if (!PlayerRegistry.instance) {
            PlayerRegistry.instance = new PlayerRegistry();
        }
        return PlayerRegistry.instance;
    }

    public addPlayer(player: Player): void {
        this.players.set(player.getUsername(), player);
    }

    public getPlayer(username: string): Player | undefined {
        return this.players.get(username);
    }

    public removePlayer(username: string): void {
        this.players.delete(username);
    }

    public getAllPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    public addFriend(playerUsername: string, friendUsername: string): boolean {
        const player = this.getPlayer(playerUsername);
        const friend = this.getPlayer(friendUsername);

        if (player && friend && !player.getFriends().includes(friendUsername)) {
            player.getFriends().push(friendUsername);
            friend.getFriends().push(playerUsername);
            return true;
        }
        return false;
    }
}

export default PlayerRegistry;