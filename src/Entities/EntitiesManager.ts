import * as pixi from "pixi.js";
import * as Globals from "../Globals.ts";
import { CollideListBehavior, Entity } from "./Entity.ts";
import { AssetsManager } from "../AssetsManager.ts";

const DEBUG_ZINDEX = 999;

function shouldCheckCollision(entity: Entity, other: Entity): boolean {
    const collideList = entity.CollideList;
    const collideListBehavior = entity.CollideListBehavior;

    if (!collideList || collideList.length === 0) return true; // No filtering

    const hasTagMatch = collideList.some((tag) => other.Tags.includes(tag));

    if (collideListBehavior === CollideListBehavior.WhiteList) {
        return hasTagMatch;
    } else if (collideListBehavior === CollideListBehavior.BlackList) {
        return !hasTagMatch;
    }

    return true;
}

function detectCollisions(entities: Entity[]): void {
    entities.sort((a, b) => a.Position.x - b.Position.x);

    for (let i = 0; i < entities.length; i++) {
        const entityA = entities[i];

        if (!entityA.Collideable) {
            continue;
        }

        for (let j = i + 1; j < entities.length; j++) {
            const entityB = entities[j];

            if (!entityB.Collideable) {
                continue;
            }

            if (entityB.Position.x > entityA.Position.x + entityA.Size.x) {
                break;
            }

            if (!shouldCheckCollision(entityA, entityB)) continue;

            if (entityA.collidesWith(entityB)) {
                if (!entityA.Static) {
                    entityA.onCollide(entityB);
                }
                if (!entityB.Static) {
                    entityB.onCollide(entityA);
                }
            }
        }
    }
}

export class EntityNotFoundException extends Error {
    constructor(name: string) {
        super(`Entity with name '${name}' not found`);
    }
}

export class EntitiesManager {
    private static instance: EntitiesManager;

    private entities: Map<string, Entity>;
    private debugContainer!: pixi.Container;

    private constructor() {
        this.entities = new Map<string, Entity>();
        if (Globals.DEBUG) {
            this.debugContainer = new pixi.Container();
            this.debugContainer.zIndex = DEBUG_ZINDEX;
        }
    }

    static get Instance(): EntitiesManager {
        if (!EntitiesManager.instance) {
            EntitiesManager.instance = new EntitiesManager();
        }
        return EntitiesManager.instance;
    }

    public instantiateEntity<T extends Entity>(
        name: string,
        // deno-lint-ignore no-explicit-any
        EntityClass: new (...args: any) => T,
        // deno-lint-ignore no-explicit-any
        entityArgs?: any[],
    ): T {
        if (this.entities.has(name)) {
            for (let i = 1; true; i++) {
                if (!this.entities.has(`${name}${i}`)) {
                    name += i;
                    break;
                }
            }
        }

        const entity = (() => {
            if (entityArgs) {
                return new EntityClass(...entityArgs);
            } else {
                return new EntityClass();
            }
        })();
        this.entities.set(name, entity);
        return entity;
    }

    public getEntity<T extends Entity>(name: string): T {
        if (!this.entities.has(name)) {
            throw new EntityNotFoundException(name);
        }
        return this.entities.get(name) as T;
    }

    public update(delta: number): void {
        if (Globals.DEBUG) {
            this.debugContainer.removeChildren();
        }

        for (const entityPair of this.entities) {
            const entityName = entityPair[0];
            const entity = entityPair[1];
            entity.update(delta);
            if (Globals.DEBUG && Globals.DEBUG_DRAW_ENITIES) {
                const infoText = new pixi.Text({
                    text:
                        `Entity: ${entityName}\nClass: ${entity.constructor.name}`,
                    style: {
                        fontFamily:
                            AssetsManager.Instance.getFont("better_vcr").family,
                        fontSize: 12,
                        fill: 0x00FF00,
                        align: "left",
                    },
                });
                infoText.position.x = entity.Position.x;
                infoText.position.y = entity.Position.y - infoText.height * 2;
                infoText.zIndex = DEBUG_ZINDEX + 1;

                const entityBBox = new pixi.Graphics();
                entityBBox
                    .rect(
                        entity.Position.x,
                        entity.Position.y,
                        entity.Size.x,
                        entity.Size.y,
                    );
                entityBBox.fill({ color: "#FF0000C0" });
                this.debugContainer.addChild(entityBBox);
                this.debugContainer.addChild(infoText);
            }
        }

        detectCollisions(Array.from(this.entities.values()));
    }

    public get DebugContainer(): pixi.Container {
        return this.debugContainer;
    }
}
