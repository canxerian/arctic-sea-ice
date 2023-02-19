import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

import arcticModel from "./models/Arctic.glb";
import Water from "./Water";

const Deg2Rad = Math.PI / 180;
export default class BabylonScene {
    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(1, -1, 3), scene);
        hemiLight.intensity = 3;

        BABYLON.SceneLoader.AppendAsync(arcticModel, "");

        const water = new Water(scene);

        const camera = this.createCamera();

        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    createCamera(canvas) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            0,
            70 * Deg2Rad,
            20,
            new BABYLON.Vector3(0, 0, 0)
        );
        cam.upperBetaLimit = 90 * Deg2Rad;

        cam.attachControl(canvas, true, true);
        return cam;
    }
}