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
        id?: string
    ) {
        super(type, rarity, growthTime, maxWater, id);
    }

    override toFirestore() {
        return {
            ...super.toFirestore(),
            nickname: this.nickname,
            location: this.location,
            age: this.age,
            currWater: this.currWater,
            growthBoost: this.growthBoost,
        };
    }

    static fromFirestore(data: any): Plant {
        return new Plant(
            data.type,
            data.rarity as Rarity,
            data.growthTime,
            data.maxWater,
            data.nickname,
            data.location,
            data.age,
            data.currWater,
            data.growthBoost,
            data.id
        );
    }
}