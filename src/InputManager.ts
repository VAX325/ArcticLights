export enum ModifierKey {
    None = "",
    Shift = "Shift",
    Ctrl = "Control",
    Alt = "Alt",
    CapsLock = "CapsLock",
}

export enum HandlerType {
    KeyPress = "keypress",
    KeyDown = "keydown",
    KeyUp = "keyup",
}

export class ActionActivatorRegisterException extends Error {
    constructor(name: string, reason: string) {
        super(
            `Failed to register activator with action name '${name}' due reason: ${reason}`,
        );
    }
}

export interface ActionActivator {
    modifierKeys?: ModifierKey[];
    keyName: string;
}

export interface ActionHandler {
    type: HandlerType;
}

export class InputManager {
    private static instance: InputManager;
    private actions: Map<string, ActionActivator>;
    private handlersKeyPress: Map<string, Array<() => void>>;
    private handlersKeyDown: Map<string, Array<() => void>>;
    private handlersKeyUp: Map<string, Array<() => void>>;

    private constructor() {
        this.actions = new Map<string, ActionActivator>();
        this.handlersKeyPress = new Map<string, Array<() => void>>();
        this.handlersKeyDown = new Map<string, Array<() => void>>();
        this.handlersKeyUp = new Map<string, Array<() => void>>();
    }

    public static get Instance(): InputManager {
        if (!this.instance) {
            this.instance = new InputManager();
        }
        return this.instance;
    }

    public registerAction(
        actionName: string,
        defaultActivator: ActionActivator,
    ): void {
        if (this.actions.has(actionName)) {
            throw new ActionActivatorRegisterException(
                actionName,
                "Action name already exists",
            );
        }
        this.actions.set(actionName, defaultActivator);
        this.handlersKeyPress.set(actionName, new Array<() => void>());
        this.handlersKeyDown.set(actionName, new Array<() => void>());
        this.handlersKeyUp.set(actionName, new Array<() => void>());
    }

    public appendHandlerToAction(
        actionName: string,
        type: HandlerType,
        handler: () => void,
    ) {
        const activator = this.actions.get(actionName);
        if (!activator) {
            throw new ActionActivatorRegisterException(
                actionName,
                "Action name does not exist",
            );
        }
        const key = activator.keyName;
        const modifierKeys = activator.modifierKeys || null;

        const handlerWrapper = (e?: KeyboardEvent) => {
            if (e && e.key !== key || !e) {
                return;
            }
            if (modifierKeys && modifierKeys.length) {
                let modifiers = e ? e.getModifierState(modifierKeys[0]) : false;
                for (let i = 1; i < modifierKeys.length; ++i) {
                    modifiers = modifiers ||
                        e?.getModifierState(modifierKeys[i]);
                }
                if (!modifiers) {
                    return;
                }
            }
            handler();
        };
        document.addEventListener(type, handlerWrapper);

        const typedMap = (() => {
            switch (type) {
                case "keydown":
                    return this.handlersKeyDown;
                case "keyup":
                    return this.handlersKeyUp;
                case "keypress":
                    return this.handlersKeyPress;
                default:
                    throw new Error(`Unknown event type ${type}`);
            }
        })();
        typedMap.get(actionName)!.push(handlerWrapper);

        return () => {
            removeEventListener(type, handler);
        };
    }
}
