import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

import arcticModel from "./models/Arctic.glb";

export default class BabylonScene {
    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);

        BABYLON.SceneLoader.AppendAsync(arcticModel, "");

        const box = BABYLON.MeshBuilder.CreateBox("box", {});
        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment();

        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}