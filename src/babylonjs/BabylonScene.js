import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import Water from "./water/Water";
import arcticModel from "./models/Arctic.babylon";
import envTexture from "./textures/kloppenheim_06_puresky_4k.env";
import ArcticIceData from "../data/ArcticIceData.json";
import IceTerrain from "./iceterrain/IceTerrain";

const Deg2Rad = Math.PI / 180;

export default class BabylonScene {
    constructor(canvas) {
        this.initialise(canvas);
    }

    async initialise(canvas) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);
        const camera = this.createCamera();

        // Gizmo 
        const gizmoManager = new BABYLON.GizmoManager(scene);
        gizmoManager.positionGizmoEnabled = true;

        // Skybox
        this.createSkybox(scene);

        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { segments: 16, diameter: 3 }, this.scene);
        sphere.position = new BABYLON.Vector3(-10, 0, 0.5);

        // const loadedArcticMesh = await BABYLON.SceneLoader.ImportMeshAsync("", arcticModel);

        const meshes = scene.getNodes().filter((node) => node instanceof BABYLON.AbstractMesh);

        // Debug sun (used only for positions to test lighting)
        this.debugSun = BABYLON.MeshBuilder.CreateSphere("Sun", { segments: 16, diameter: 1 }, this.scene);
        this.debugSun.position = new BABYLON.Vector3(0, 10, 100);

        // Ice Terrain
        this.iceTerrain = new IceTerrain(scene, this.debugSun);

        // Depth texture setup (for water)
        const depthRenderer = scene.enableDepthRenderer(scene.activeCamera, false);
        const depthTex = depthRenderer.getDepthMap();
        depthTex.renderList = [...meshes, sphere, /* this.iceTerrain.mesh */];

        // Render Target Texture (for water)
        const refractionTex = new BABYLON.RenderTargetTexture("water_refraction", { width: 256, height: 256 }, scene, false, true);
        refractionTex.wrapU = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        refractionTex.wrapV = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        refractionTex.ignoreCameraViewport = true;
        refractionTex.renderList = depthTex.renderList;
        refractionTex.refreshRate = 1;

        const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

        this.water = new Water(scene, depthTex, this.debugSun);

        engine.runRenderLoop(() => {
            this.water.update();
            this.iceTerrain.update();
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
        cam.lowerBetaLimit = 1 * Deg2Rad;
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

    setActiveIceIndex(index) {
        if (this.iceTerrain) {
            this.iceTerrain.updateDataIndex(index);
        }
    }
}