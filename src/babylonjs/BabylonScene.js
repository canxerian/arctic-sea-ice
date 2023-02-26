import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { Pane } from "tweakpane";

import arcticModel from "./models/Arctic.glb";
import Water from "./Water";
import SceneData from "./SceneData.json";

import envTexture from "./textures/kloppenheim_06_puresky_4k.env";

const Deg2Rad = Math.PI / 180;
export default class BabylonScene {
    constructor(canvas) {
        this.initialise(canvas);
    }

    async initialise(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);
        const camera = this.createCamera();

        const debugMenu = this.createDebugMenu();

        // Gizmo 
        const gizmoManager = new BABYLON.GizmoManager(scene);
        gizmoManager.positionGizmoEnabled = true;

        // Skybox
        this.createSkybox(scene);

        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { segments: 16, diameter: 3 }, this.scene);
        sphere.position = new BABYLON.Vector3(-10, 0, 0.5);

        const loadedArcticMesh = await BABYLON.SceneLoader.ImportMeshAsync("", arcticModel);
        // Clear color
        // scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        // Depth texture setup (for water)
        const depthRenderer = scene.enableDepthRenderer(scene.activeCamera, false);
        const depthTex = depthRenderer.getDepthMap();
        depthTex.renderList = [...loadedArcticMesh.meshes, sphere];

        // Render Target Texture (for water)
        const refractionRTT = new BABYLON.RenderTargetTexture("water_refraction", { width: 256, height: 256 }, scene, false, true);
        refractionRTT.wrapU = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        refractionRTT.wrapV = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        refractionRTT.ignoreCameraViewport = true;
        refractionRTT.renderList = depthTex.renderList;
        refractionRTT.refreshRate = 1;

        const hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(1, -1, 3), scene);
        hemiLight.intensity = 3;

        this.water = new Water(scene, depthTex, refractionRTT, debugMenu);

        engine.runRenderLoop(() => {
            this.water.update();
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        })
    }

    createCamera(canvas) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            -90 * Deg2Rad,
            70 * Deg2Rad,
            60,
            new BABYLON.Vector3(0, 0, 0)
        );
        cam.lowerRadiusLimit = 10;
        cam.upperRadiusLimit = 100;
        cam.lowerBetaLimit = 0 * Deg2Rad;
        cam.upperBetaLimit = 80 * Deg2Rad;
        cam.minZ = 0.01;
        cam.maxZ = 1000;
        cam.attachControl(canvas, true, true);
        return cam;
    }

    /**
     * 
     * @param {BABYLON.Scene} scene 
     */
    createSkybox(scene) {
        scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(envTexture, scene);
        scene.createDefaultSkybox(scene.environmentTexture, true, 10 * scene.activeCamera.maxZ);
        scene.imageProcessingConfiguration.toneMappingEnabled = true;
        scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD;
    }

    createDebugMenu() {
        const pane = new Pane({ title: "Debug Menu" });

        Object.keys(SceneData).forEach((key) => {
            if (key === "WaterStrength") {
                pane.addInput(SceneData, key, { min: 0, max: 1 });
            }
            else if (typeof SceneData[key] === "number") {
                pane.addInput(SceneData, key, { min: 0, max: 10 });
            }
            else if (typeof SceneData[key] === "object" && SceneData[key].r) {
                pane.addInput(SceneData, key, { color: { type: "float" } });
            }
        });

        const saveBtn = pane.addButton({ title: "Save", label: "Save" });
        const onClickSave = async () => {
            const preset = pane.exportPreset();
            const opts = {
                suggestedName: "SceneData",
                excludeAcceptAllOption: true,
                types: [{
                    description: 'JSON',
                    accept: { 'application/json': ['.json'] },
                }],
            };
            const saveFile = await window.showSaveFilePicker(opts);
            const writable = await saveFile.createWritable();
            await writable.write(JSON.stringify(preset));
            await writable.close();
        }
        saveBtn.on("click", onClickSave);

        return pane;
    }
}