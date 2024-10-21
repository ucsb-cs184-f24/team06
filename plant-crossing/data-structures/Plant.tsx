enum Rarity{
    common, rare, unique, legendary
}

const coinMapping: { [key in Rarity] : number } = {
    [Rarity.common]: 2,
    [Rarity.rare]: 3,
    [Rarity.unique]: 4,
    [Rarity.legendary]: 5
}

class Plant {
    private type: string; //type of plant
    private nickname: string; //optional, name your plant
    private age: number;
    // private currSprite:  // add image links later, store in plant-sprites folder?
    private rarity: Rarity; //enum, types listed above
    private currWater: number; //decreases over time
    private maxWater: number; //scale of 10
    private currHappiness: number; //scale of 10
    private maxHappiness: number; //scale of 10

    public constructor(
        type: string = "defaultPlant",
        nickname: string = "",
        rarity: string = "",
        maxWater: number = 5,
        maxHappiness: number = 5
        
    ){
        this.type = type;
        this.nickname = nickname;
        this.age = 0
        this.rarity = rarity as unknown as Rarity;
        this.currWater = maxWater;
        this.maxWater = maxWater;
        this.currHappiness = maxHappiness;
        this.maxHappiness = maxHappiness;
    }


    // Skeleton code for future functionalites
    public waterPlant(){
        this.currWater = this.maxWater;
    }

    public increaseHappiness(){

    }

    // Getters/setters
    public getType() {
        return this.type;
    }

    public setType(type:string){
        this.type = type;
    }

    public getNickname() {
        return this.nickname;
    }

    public setNickname(nickname:string){
        this.nickname = this.nickname;
    }

    public getRarity(){
        return this.rarity;
    }

    public setRarity(rarity:string){
        this.rarity = rarity as unknown as Rarity;
    }

    public getCurrWater(){
        return this.currWater;
    }

    public setCurrWater(currWater:number){
        this.currWater = currWater;
    }

    public getMaxWater(){
        return this.maxWater;
    }

    public setMaxWater(maxWater: number){
        this.maxWater = this.maxWater;
    }

    public getCurrHappiness(){
        return this.currHappiness;
    }

    public setCurrHappiness(currHappiness:number){
        this.currHappiness = currHappiness;
    }

    public getMaxHappiness(){
        return this.maxHappiness;
    }

    public setMaxHappiness(maxHappiness: number){
        this.maxHappiness = this.maxHappiness;
    }

    public produceCoins(){ //coins produced is a function of water level, rarity and happiness
        if(this.currWater >= (this.maxWater/2)){
            return Math.floor((this.currWater / this.maxWater)
                    * (1 + (this.currHappiness / this.maxHappiness)) // multiplier added if plant is happy
                    * coinMapping[this.rarity]);
        }
        return 0;
    }
}