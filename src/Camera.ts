import * as pixi from "pixi.js";
import { GameObject } from "./GameObject.ts";

export class Camera {
    private world: pixi.Container;
    private position: pixi.Point;
    private transitionSpeed: number = 0.1;
    private zoom: number = 1;
    private rotation: number = 0;
    private target: GameObject | null;
    private app: pixi.Application;

    private dX: number = 0;
    private dY: number = 0;

    constructor(world: pixi.Container, app: pixi.Application) {
        this.world = world;
        this.position = new pixi.Point(0, 0);
        this.target = null;
        this.app = app;
    }

    get Position(): pixi.Point {
        return this.position.clone();
    }

    get Target(): GameObject | null {
        return this.target;
    }

    get Zoom(): number {
        return this.zoom;
    }
    set Zoom(value: number) {
        this.zoom = value;
    }

    get Rotation(): number {
        return this.rotation;
    }
    set Rotation(value: number) {
        this.rotation = value;
    }

    get TransitionSpeed(): number {
        return this.transitionSpeed;
    }

    set TransitionSpeed(value: number) {
        this.transitionSpeed = value;
    }

    public moveTo(position: pixi.Point): void {
        if (!this.target) {
            this.position = position;
        }
    }

    public setFollowTarget(target: GameObject | null): void {
        this.target = target;
    }

    public update(): void {
        if (this.target) {
            this.position = new pixi.Point(
                this.target.Position.x,
                this.target.Position.y,
            );
        }

        this.dX += (this.position.x - this.dX) *
            this.transitionSpeed;
        this.dY += (this.position.y - this.dY) *
            this.transitionSpeed;

        const centerX = this.app.renderer.width / 2;
        const centerY = this.app.renderer.height / 2;

        this.world.position.set(
            centerX - this.dX * this.zoom,
            centerY - this.dY * this.zoom,
        );

        this.world.scale.set(this.zoom);
        this.world.rotation = this.rotation;
    }
}
