import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

import arcticModel from "./models/Arctic.glb";

export default class BabylonScene {
    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);

        BABYLON.SceneLoader.AppendAsync(arcticModel, "");

        const box = BABYLON.MeshBuilder.CreateBox("box", {});
        box.position = new BABYLON.Vector3(0, 10, 0);
        const camera = this.createCamera();

        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    createCamera(canvas) {
        const Deg2Rad = Math.PI / 180;

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