import { DisposableStore } from "./lib/disposables";
import { StepsRunner } from "./lib/steps/StepsRunner";
import { hotReloadExportedItem } from "@hediet/node-reload";
import { getSteps } from "./steps";
import { ArtifactRef, getArch, getOs, VsCodeArtifactName } from "./getDownloadUrl";

export function run() {
    const store = new DisposableStore();

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);

    });

    async function main() {

        const runner = store.add(new StepsRunner());

        const artifact2 = new ArtifactRef(
            'cb0c47c0cfaad0757385834bd89d410c78a856c0',
            VsCodeArtifactName.build({
                arch: getArch(),
                os: getOs(),
                type: 'server',
                flavor: 'web',
            }),
            "stable",
        );

        const artifact = new ArtifactRef(
            '488a1f239235055e34e673291fb8d8c810886f81',
            VsCodeArtifactName.build({
                arch: getArch(),
                os: getOs(),
                type: 'cli',
            }),
            "stable",
        );

        store.add(hotReloadExportedItem(getSteps, f => {
            const store = new DisposableStore();
            const steps = f(store, artifact);
            runner.update(steps);

            console.log("Steps updated", steps);

            return {
                dispose: () => {
                    store.dispose();
                }
            }
        }));


        try {
            await runner.getFinalResult();
        } catch (e) {
            console.error(e);
        }

    }

    main();

    return store;
}
