import * as pixi from "pixi.js";
import { Building } from "./Building.ts";

export class TestBuilding extends Building {
    public constructor() {
        super({
            size: new pixi.Point(4, 2),
            collideable: true,
        });
    }

    protected override buildingTick(delta: number): void {
    }
}
