import * as BABYLON from "@babylonjs/core";

export default class BabylonScene {
    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);
        const box = BABYLON.MeshBuilder.CreateBox("box", {});
        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment();

        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}