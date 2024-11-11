import * as pixi from "pixi.js";
import * as Globals from "../Globals.ts";
import { Entity } from "../Entities/Entity.ts";
import { AssetsManager } from "../AssetsManager.ts";

export interface BuildingOptions {
    size: pixi.Point;
    collideable: boolean;
}

export abstract class Building extends Entity {
    protected constructor(options: BuildingOptions) {
        super({
            gameObjectOptions: {
                texture: AssetsManager.Instance.getTexture(
                    "debug_placeholder",
                ),
                position: new pixi.Point(0, 0),
                size: new pixi.Point(
                    Globals.ONE_CELL_SIZE * options.size.x,
                    Globals.ONE_CELL_SIZE * options.size.y,
                ),
            },
            collideOptions: {
                collideable: options.collideable,
                static: true,
            },
            tags: ["building"],
        });
    }

    public override update(delta: number): void {
        super.update(delta);
    }

    protected abstract buildingTick(delta: number): void;
}
