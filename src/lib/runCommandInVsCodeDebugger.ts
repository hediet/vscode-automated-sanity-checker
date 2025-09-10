
export function runCommandInVsCodeDebugger(commandId: string, ...args: unknown[]) {
    interface ISimpleSet<T> {
        add(value: T): void;
        delete(value: T): void;
    }
    interface GlobalObj {
        $$debugValueEditor_runVsCodeCommand?: (commandId: string, ...args: unknown[]) => void;
        $$debugValueEditor_onConnected?: ISimpleSet<() => void>;
    }

    const g = globalThis as any as GlobalObj;
    (g.$$debugValueEditor_onConnected = g.$$debugValueEditor_onConnected || new Set()).add(() => {
        g.$$debugValueEditor_runVsCodeCommand!(commandId, ...args);
    });
}
