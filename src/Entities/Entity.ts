import { GameObject, GameObjectOptions } from "../GameObject.ts";

export enum CollideListBehavior {
    WhiteList,
    BlackList,
}

export interface EntityOptions {
    gameObjectOptions: GameObjectOptions;
    collideOptions: {
        collideable: boolean;
        static: boolean;
        collideList?: Array<string>;
        collideListBehavior?: CollideListBehavior;
    };
    tags: Array<string>;
    /*aiOptions: {
        aiProcessor?: AIProcessor;
    };*/
}

export abstract class Entity extends GameObject {
    protected collideable: boolean;
    protected collideList: Array<string>;
    protected collideListBehavior: CollideListBehavior;
    protected static: boolean;
    protected tags: Array<string>;

    public constructor(options: EntityOptions) {
        super(options.gameObjectOptions);

        this.collideable = options.collideOptions.collideable;
        this.collideList = options.collideOptions.collideList || [];
        this.collideListBehavior = options.collideOptions.collideListBehavior ||
            CollideListBehavior.BlackList;
        this.static = options.collideOptions.static;

        this.tags = options.tags;
    }

    public collidesWith(other: Entity): boolean {
        return (
            this.position.x < other.position.x + other.size.x &&
            this.position.x + this.size.x > other.position.x &&
            this.position.y < other.position.y + other.size.y &&
            this.position.y + this.size.y > other.position.y
        );
    }

    public override update(delta: number): void {
        super.update(delta);
    }

    public onCollide(other: Entity): void {
        if (!this.collideable) {
            return;
        }

        const dx = (this.position.x + this.size.x / 2) -
            (other.position.x + other.size.x / 2);
        const dy = (this.position.y + this.size.y / 2) -
            (other.position.y + other.size.y / 2);

        const overlapX = (this.size.x + other.size.x) / 2 - Math.abs(dx);
        const overlapY = (this.size.y + other.size.y) / 2 - Math.abs(dy);

        if (overlapX < overlapY) {
            this.position.x += dx > 0 ? overlapX : -overlapX;
            this.sprite.x += dx > 0 ? overlapX : -overlapX;
        } else {
            this.position.y += dy > 0 ? overlapY : -overlapY;
            this.sprite.y += dy > 0 ? overlapY : -overlapY;
        }
    }

    get Collideable(): boolean {
        return this.collideable;
    }

    get Static(): boolean {
        return this.static;
    }

    get CollideList(): Array<string> {
        return this.collideList;
    }

    get CollideListBehavior(): CollideListBehavior {
        return this.collideListBehavior;
    }

    get Tags(): Array<string> {
        return this.tags;
    }
}
