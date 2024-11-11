import * as pixi from "pixi.js";
import * as Globals from "../Globals.ts";
import { Entity } from "./Entity.ts";
import { AssetsManager } from "../AssetsManager.ts";
import { HandlerType, InputManager } from "../InputManager.ts";

export class Player extends Entity {
    private directions: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    };

    private speed: number;

    constructor() {
        super(
            {
                gameObjectOptions: {
                    texture: AssetsManager.Instance.getTexture("player"),
                    position: new pixi.Point(0, 0),
                    size: new pixi.Point(
                        Globals.ONE_CELL_SIZE,
                        Globals.ONE_CELL_SIZE,
                    ),
                },
                collideOptions: {
                    collideable: true,
                    static: false,
                },
                tags: ["player"],
            },
        );

        this.directions = { up: false, down: false, left: false, right: false };
        this.speed = 4;

        InputManager.Instance.appendHandlerToAction(
            "#MoveLeft",
            HandlerType.KeyDown,
            () => this.directions.left = true,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveRight",
            HandlerType.KeyDown,
            () => this.directions.right = true,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveUp",
            HandlerType.KeyDown,
            () => this.directions.up = true,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveDown",
            HandlerType.KeyDown,
            () => this.directions.down = true,
        );

        InputManager.Instance.appendHandlerToAction(
            "#MoveLeft",
            HandlerType.KeyUp,
            () => this.directions.left = false,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveRight",
            HandlerType.KeyUp,
            () => this.directions.right = false,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveUp",
            HandlerType.KeyUp,
            () => this.directions.up = false,
        );
        InputManager.Instance.appendHandlerToAction(
            "#MoveDown",
            HandlerType.KeyUp,
            () => this.directions.down = false,
        );
    }

    public override update(delta: number): void {
        super.update(delta);

        const direction = { x: 0, y: 0 };
        if (this.directions.left) {
            direction.x -= 1;
        }
        if (this.directions.right) {
            direction.x += 1;
        }
        if (this.directions.up) {
            direction.y -= 1;
        }
        if (this.directions.down) {
            direction.y += 1;
        }

        direction.x *= this.speed * delta;
        direction.y *= this.speed * delta;

        this.position.x += direction.x;
        this.position.y += direction.y;

        this.sprite.x += direction.x;
        this.sprite.y += direction.y;
    }

    public override onCollide(other: Entity): void {
        super.onCollide(other);
    }
}
