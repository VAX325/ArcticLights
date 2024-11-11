import * as pixi from "pixi.js";
import { World } from "./World.ts";
import { AssetsManager } from "./AssetsManager.ts";
import { InputManager } from "./InputManager.ts";
import * as Globals from "./Globals.ts";

class DebugGame {
    private app: pixi.Application;
    private world: World;
    private fpsCounter: pixi.Text;
    private fpsLastUpdate: number;

    constructor(app: pixi.Application, world: World) {
        this.app = app;
        this.world = world;
        this.fpsCounter = new pixi.Text({
            text: "Fps: 0",
            style: {
                fontFamily: AssetsManager.Instance.getFont("better_vcr").family,
                fontSize: 24,
                fill: 0x00FF00,
                align: "center",
            },
        });
        this.fpsCounter.position.x = 10;
        this.fpsCounter.position.y = 10;
        this.app.stage.addChild(this.fpsCounter);

        this.fpsLastUpdate = Date.now();
    }

    public update(delta: pixi.Ticker): void {
        if (Date.now() - this.fpsLastUpdate >= 1000) {
            this.fpsCounter.text = `Fps: ${Math.floor(delta.FPS)}`;
            this.fpsLastUpdate = Date.now();
        }
    }
}

class Game {
    private app: pixi.Application;
    private world!: World;
    private debugGame!: DebugGame;

    constructor() {
        this.app = new pixi.Application();
        this.app.init({
            background: "#000000",
            resizeTo: window,
            preference: "webgl",
            antialias: true,
            roundPixels: false,
            autoDensity: true,
        }).then(
            () => this.constructorImpl(),
        ).catch(
            (error) => console.log("Error: ", error),
        );
    }

    private constructorImpl(): void {
        document.body.appendChild(this.app.canvas);
        this.initializeDefaultKeyboardActions();
        AssetsManager.Instance.initialize(() => this.initializeWorld());
    }

    private initializeDefaultKeyboardActions() {
        InputManager.Instance.registerAction("#MoveLeft", {
            keyName: "a",
        });

        InputManager.Instance.registerAction("#MoveRight", {
            keyName: "d",
        });

        InputManager.Instance.registerAction("#MoveUp", {
            keyName: "w",
        });

        InputManager.Instance.registerAction("#MoveDown", {
            keyName: "s",
        });
    }

    private initializeWorld(): void {
        this.world = new World(this.app);
        this.app.stage.addChild(this.world.WorldContainer);

        if (Globals.DEBUG) {
            this.debugGame = new DebugGame(this.app, this.world);
        }

        this.app.ticker.add((delta) => this.update(delta));
    }

    private update(delta: pixi.Ticker): void {
        this.world.update(delta.deltaTime);
        this.debugGame.update(delta);
    }
}

globalThis.onload = () => new Game();
