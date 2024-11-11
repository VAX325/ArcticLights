import * as pixi from "pixi.js";
import * as Globals from "./Globals.ts";

enum AssetType {
    BUNDLE = "Bundle",
    TEXTURE = "Texture",
    CONFIG = "Config",
    SOUND = "Sound",
    FONT = "Font",
}

interface AssetBundle {
    textures: Map<string, pixi.Texture>;
    configs: Map<string, object>;
    sounds: Map<string, HTMLAudioElement>;
    fonts: Map<string, FontFace>;
}

export interface AssetBundleItem {
    name: string;
    path: string;
}

export interface AssetBundleDescriptor {
    textures?: Array<AssetBundleItem>;
    configs?: Array<AssetBundleItem>;
    sounds?: Array<AssetBundleItem>;
    fonts?: Array<AssetBundleItem>;
}

export class AssetBundleRegisterException extends Error {
    constructor(name: string, reason: string) {
        super(
            `Failed to register AssetBundle with name '${name}' due reason: ${reason}`,
        );
    }
}

export class AssetNotFoundException extends Error {
    constructor(type: AssetType, name: string) {
        super(`Asset with type '${type}' and name '${name}' not found`);
    }
}

export class AssetsManager {
    private static instance: AssetsManager;

    private assetsBundles: Map<string, AssetBundle>;

    private constructor() {
        this.assetsBundles = new Map<string, AssetBundle>();
    }

    public initialize(doneCallback: () => void): void {
        pixi.Assets.load(`./${Globals.GAME_NAME}_abundle.json`).then((bundle) =>
            this.registerAssetBundle(
                Globals.GAME_NAME,
                bundle,
            ).then(doneCallback)
        );
    }

    public async registerAssetBundle(
        bundleName: string,
        bundle: AssetBundleDescriptor,
    ): Promise<void> {
        if (this.assetsBundles.has(bundleName)) {
            throw new AssetBundleRegisterException(
                bundleName,
                "Bundle with that name already registred",
            );
        }

        const assetBundle: AssetBundle = {
            textures: new Map<string, pixi.Texture>(),
            configs: new Map<string, object>(),
            sounds: new Map<string, HTMLAudioElement>(),
            fonts: new Map<string, FontFace>(),
        };

        if (bundle.textures) {
            for (const texture of bundle.textures) {
                if (assetBundle.textures.has(texture.name)) {
                    throw new AssetBundleRegisterException(
                        bundleName,
                        `Duplicated texture '${texture.name}'`,
                    );
                }

                assetBundle.textures.set(
                    texture.name,
                    await pixi.Assets.load(texture.path),
                );
            }
        }

        if (bundle.configs) {
            for (const config of bundle.configs) {
                if (assetBundle.configs.has(config.name)) {
                    throw new AssetBundleRegisterException(
                        bundleName,
                        `Duplicated config '${config.name}'`,
                    );
                }

                assetBundle.configs.set(
                    config.name,
                    await pixi.Assets.load(config.path),
                );
            }
        }

        if (bundle.sounds) {
            for (const sound of bundle.sounds) {
                if (assetBundle.sounds.has(sound.name)) {
                    throw new AssetBundleRegisterException(
                        bundleName,
                        `Duplicated sound '${sound.name}'`,
                    );
                }

                assetBundle.sounds.set(
                    sound.name,
                    new Audio(sound.path),
                );
            }
        }

        if (bundle.fonts) {
            for (const font of bundle.fonts) {
                if (assetBundle.fonts.has(font.name)) {
                    throw new AssetBundleRegisterException(
                        bundleName,
                        `Duplicated font '${font.name}'`,
                    );
                }

                assetBundle.fonts.set(
                    font.name,
                    await pixi.Assets.load(font.path),
                );
            }
        }

        this.assetsBundles.set(bundleName, assetBundle);
    }

    public static get Instance(): AssetsManager {
        if (!this.instance) {
            this.instance = new AssetsManager();
        }
        return this.instance;
    }

    public getTexture(
        name: string,
        allowPlaceholder: boolean = true,
        fromBundle: string = Globals.GAME_NAME,
    ): pixi.Texture {
        if (!this.assetsBundles.has(fromBundle)) {
            throw new AssetNotFoundException(
                AssetType.BUNDLE,
                fromBundle,
            );
        }

        const asset = this.assetsBundles.get(fromBundle)!.textures.get(name);
        if (!asset) {
            if (!allowPlaceholder) {
                throw new AssetNotFoundException(
                    AssetType.TEXTURE,
                    name,
                );
            } else {
                return this.getTexture(
                    "debug_placeholder",
                    false,
                    Globals.GAME_NAME,
                );
            }
        }
        return asset;
    }

    public getConfig(
        name: string,
        fromBundle: string = Globals.GAME_NAME,
    ): object {
        if (!this.assetsBundles.has(fromBundle)) {
            throw new AssetNotFoundException(
                AssetType.BUNDLE,
                fromBundle,
            );
        }

        const config = this.assetsBundles.get(fromBundle)!.configs.get(name);
        if (!config) {
            throw new AssetNotFoundException(
                AssetType.CONFIG,
                name,
            );
        }
        return config;
    }

    public getSound(
        name: string,
        fromBundle: string = Globals.GAME_NAME,
    ): HTMLAudioElement {
        if (!this.assetsBundles.has(fromBundle)) {
            throw new AssetNotFoundException(
                AssetType.BUNDLE,
                fromBundle,
            );
        }
        const asset = this.assetsBundles.get(fromBundle)!.sounds.get(name);
        if (!asset) {
            throw new AssetNotFoundException(
                AssetType.SOUND,
                name,
            );
        }

        return asset;
    }

    public getFont(
        name: string,
        fromBundle: string = Globals.GAME_NAME,
    ): FontFace {
        if (!this.assetsBundles.has(fromBundle)) {
            throw new AssetNotFoundException(
                AssetType.BUNDLE,
                fromBundle,
            );
        }
        const asset = this.assetsBundles.get(fromBundle)!.fonts.get(name);
        if (!asset) {
            throw new AssetNotFoundException(
                AssetType.FONT,
                name,
            );
        }
        return asset;
    }
}
