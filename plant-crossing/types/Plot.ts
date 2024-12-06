import { Plant } from "./Plant";

export class Plot {
    public location: number;
    public unlocked: boolean;
    public plant: Plant | null;

    public constructor(
      unlocked: boolean,
      location: number,
    ) {
      this.unlocked = unlocked;
      this.plant = null;
      this.location = location;
    };



}