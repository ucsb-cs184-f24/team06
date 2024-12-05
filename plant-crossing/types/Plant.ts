import { Rarity, Seed } from "./Seed";

export class Plant extends Seed {
    constructor(
        type: string,
        rarity: Rarity,
        growthTime: number,
        maxWater: number,
        public nickname: string = "",
        public location: number,
        public age: number = 0,
        public currWater: number = maxWater,
        public growthBoost: number = 1,
        public growthLevel: number = 1,
        public id?: string,
        public createdAt: number = Date.now(), // Default to current time
        public lastUpdated: number = Date.now() // Default to current time
    ) {
        super(type, rarity, growthTime, maxWater);
    }

    override toFirestore() {
        return {
            ...super.toFirestore(),
            nickname: this.nickname,
            location: this.location,
            age: this.age,
            currWater: this.currWater,
            growthBoost: this.growthBoost,
            growthLevel: this.growthLevel,
            createdAt: this.createdAt,
            lastUpdated: this.lastUpdated,
        };
    }

    static fromFirestore(data: any, id?: string): Plant {
        // Ensure timestamps are handled correctly
        const createdAt = data.createdAt?.toMillis
            ? data.createdAt.toMillis() // Firebase Timestamp -> milliseconds
            : data.createdAt || Date.now(); // Fallback to current time if missing

        const lastUpdated = data.lastUpdated?.toMillis
            ? data.lastUpdated.toMillis()
            : data.lastUpdated || createdAt; // Default to `createdAt` if missing

        const plant = new Plant(
            data.type,
            data.rarity as Rarity,
            data.growthTime,
            data.maxWater,
            data.nickname,
            data.location,
            data.age || 0,
            data.currWater || data.maxWater,
            data.growthBoost || 1,
            data.growthLevel || 1,
            id,
            createdAt,
            lastUpdated
        );

        plant.id = id; // Assign the ID separately if provided
        return plant;
    }
}
