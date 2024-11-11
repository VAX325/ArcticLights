import * as pixi from "pixi.js";
import * as Globals from "./Globals.ts";
import { GameObject } from "./GameObject.ts";
import { Camera } from "./Camera.ts";
import { Player } from "./Entities/Player.ts";
import { TestBuilding } from "./BuildingSystem/TestBuilding.ts";
import { EntitiesManager } from "./Entities/EntitiesManager.ts";

export class World {
    private worldContainer: pixi.Container;
    private camera: Camera;
    private player: Player;
    private gameObjects: Array<GameObject>;

    private debugDrawings!: pixi.Container;

    constructor(app: pixi.Application) {
        this.worldContainer = new pixi.Container(
            {
                width: Globals.WORLD_WIDTH_IN_PX,
                height: Globals.WORLD_HEIGHT_IN_PX,
                label: "world",
            },
        );

        this.camera = new Camera(this.worldContainer, app);
        this.player = EntitiesManager.Instance.instantiateEntity(
            "localPlayer",
            Player,
        );
        this.camera.setFollowTarget(this.player);

        this.worldContainer.addChild(this.player.Container);
        this.gameObjects = new Array<GameObject>();

        if (Globals.DEBUG) {
            this.debugDrawings = new pixi.Container();
            this.debugDrawings.zIndex = -1;
            this.worldContainer.addChild(this.debugDrawings);

            this.worldContainer.addChild(
                EntitiesManager.Instance.DebugContainer,
            );
        }

        if (Globals.DEBUG && Globals.DEBUG_LOAD_DEBUG_WORLD) {
            this.loadDebugWorld();
        } else {
            // this.loadWorld();
        }

        if (Globals.DEBUG && Globals.DEBUG_DRAW_SNAP_GRID) {
            // Draw snap grid
            const grid = new pixi.Graphics();
            this.worldContainer.addChild(grid);

            for (
                let i = 0;
                i < Globals.WORLD_WIDTH_IN_PX;
                i += Globals.ONE_CELL_SIZE
            ) {
                grid.moveTo(i, 0)
                    .lineTo(
                        i,
                        Globals.WORLD_HEIGHT_IN_PX,
                    );
                grid.stroke({ width: 1, color: 0xFF0000 });
            }

            for (
                let i = 0;
                i < Globals.WORLD_WIDTH_IN_PX;
                i += Globals.ONE_CELL_SIZE
            ) {
                grid.moveTo(0, i)
                    .lineTo(
                        Globals.WORLD_WIDTH_IN_PX,
                        i,
                    );
                grid.stroke({ width: 1, color: 0xFF0000 });
            }
        }
    }

    public static snapToGrid(obj: GameObject, wantedPos: pixi.Point): void {
        obj.Position = new pixi.Point(
            Math.floor(wantedPos.x / Globals.ONE_CELL_SIZE) *
                    Globals.ONE_CELL_SIZE + (Globals.ONE_CELL_SIZE / 2),
            Math.floor(wantedPos.y / Globals.ONE_CELL_SIZE) *
                    Globals.ONE_CELL_SIZE + (Globals.ONE_CELL_SIZE / 2),
        );
    }

    public static placeOnCell(obj: GameObject, wantedCell: pixi.Point): void {
        obj.Position = new pixi.Point(
            Math.floor(wantedCell.x * Globals.ONE_CELL_SIZE),
            Math.floor(wantedCell.y * Globals.ONE_CELL_SIZE),
        );
    }

    private loadDebugWorld() {
        World.placeOnCell(
            this.player,
            new pixi.Point(
                10,
                10,
            ),
        );

        const test_building = EntitiesManager.Instance.instantiateEntity(
            "testBuilding",
            TestBuilding,
        );
        this.worldContainer.addChild(test_building.Container);
        World.placeOnCell(
            test_building,
            new pixi.Point(
                10,
                15,
            ),
        );

        const test_building2 = EntitiesManager.Instance.instantiateEntity(
            "testBuilding",
            TestBuilding,
        );
        this.worldContainer.addChild(test_building2.Container);
        World.placeOnCell(
            test_building2,
            new pixi.Point(
                20,
                15,
            ),
        );
    }

    public update(delta: number) {
        this.player.update(delta);
        this.camera.update();
        for (const gameObject of this.gameObjects) {
            gameObject.update(delta);
        }
        EntitiesManager.Instance.update(delta);
    }

    public get WorldContainer() {
        return this.worldContainer;
    }
}
