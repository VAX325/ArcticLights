import * as pixi from "pixi.js";

export interface GameObjectOptions {
    texture: pixi.Texture;
    position: pixi.Point;
    size: pixi.Point;
    anchor?: pixi.Point;
    tiledOptions?: {
        positionInTileset: pixi.Point;
    };
}

export class GameObject {
    protected container: pixi.Container;
    protected sprite: pixi.Sprite | pixi.TilingSprite;
    protected position: pixi.Point;
    protected size: pixi.Point;
    protected anchor: pixi.Point;

    public constructor(
        options: GameObjectOptions,
    ) {
        this.container = new pixi.Container();
        this.position = options.position;
        this.size = options.size;
        this.anchor = options.anchor || new pixi.Point(0, 0);
        if (!options.tiledOptions) {
            this.sprite = new pixi.Sprite({
                texture: options.texture,
                width: this.size.x,
                height: this.size.y,
                x: this.position.x,
                y: this.position.y,
                anchor: {
                    x: this.anchor.x,
                    y: this.anchor.y,
                },
            });
        } else {
            this.sprite = new pixi.TilingSprite({
                texture: options.texture,
                width: this.size.x,
                height: this.size.y,
                x: this.position.x,
                y: this.position.y,
                anchor: {
                    x: this.anchor.x,
                    y: this.anchor.y,
                },
                tilePosition: {
                    x: options.tiledOptions.positionInTileset.x,
                    y: options.tiledOptions.positionInTileset.y,
                },
            });
        }
        this.container.addChild(this.sprite);
    }

    public get Position(): pixi.Point {
        return this.position.clone();
    }

    public set Position(value: pixi.Point) {
        this.position = value;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }

    public get Size(): pixi.Point {
        return this.size.clone();
    }

    public get Container(): pixi.Container {
        return this.container;
    }

    // deno-lint-ignore no-unused-vars
    public update(delta: number) {
    }
}
