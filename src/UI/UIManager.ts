import * as pixi from "pixi.js";
import * as Globals from "../Globals.ts";

export interface UIPanelOptions {
    position: pixi.Point;
    size: pixi.Point;
}

export class UIPanel {
    private container: pixi.Container;
    private uiElements: [] = [];

    public constructor(options: UIPanelOptions) {
        this.container = new pixi.Container();
        this.container.position.x = options.position.x;
        this.container.position.y = options.position.y;
        this.container.width = options.size.x;
        this.container.height = options.size.y;
    }

    set Scale(scale: number) {
        this.container.scale.set(scale);
    }

    get Container(): pixi.Container {
        return this.container;
    }

    public update(delta: number) {
        /*for (let i = 0; i < this.uiElements.length; i++) {
            this.uiElements[i].update(delta);
        }*/
    }
}

export class UIManager {
    private static instance: UIManager;
    private app!: pixi.Application;
    private scale!: number;
    private panels!: Array<UIPanel>;

    private constructor() {
    }

    public Initialize(app: pixi.Application): void {
        this.app = app;
        this.scale = Math.min(
            this.app.renderer.width / Globals.UI_VIRTUAL_DEVICE_WIDTH,
            this.app.renderer.height / Globals.UI_VIRTUAL_DEVICE_HEIGHT,
        );

        globalThis.addEventListener("resize", () => {
            this.scale = Math.min(
                this.app.renderer.width / Globals.UI_VIRTUAL_DEVICE_WIDTH,
                this.app.renderer.height / Globals.UI_VIRTUAL_DEVICE_HEIGHT,
            );
            this.panels.forEach((panel) => panel.Scale = this.scale);
        });

        this.panels = new Array<UIPanel>();
    }

    public static get Instance(): UIManager {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }

    public update(delta: number): void {
        for (let i = 0; i < this.panels.length; ++i) {
            this.panels[i].update(delta);
        }
    }
}
