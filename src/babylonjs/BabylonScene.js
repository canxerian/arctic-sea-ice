import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import Water from "./water/Water";
import envTexture from "./textures/kloppenheim_06_puresky_4k.env";
import IceTerrain from "./iceterrain/IceTerrain";
import OnValueChange from "./OnValueChange";

const Deg2Rad = Math.PI / 180;

const CameraState = {
    Idle: 0,
    Rotating: 1,
    Zooming: 2
};

const MaxZoomAlphaTarget = 90 * Deg2Rad;
const MaxZoomBetaTarget = 1 * Deg2Rad;

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
        // const depthRenderer = scene.enableDepthRenderer(scene.activeCamera, false);
        // const depthTex = depthRenderer.getDepthMap();
        // depthTex.renderList = [...meshes, sphere, /* this.iceTerrain.mesh */];

        // Render Target Texture (for water)
        // const refractionTex = new BABYLON.RenderTargetTexture("water_refraction", { width: 256, height: 256 }, scene, false, true);
        // refractionTex.wrapU = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        // refractionTex.wrapV = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
        // refractionTex.ignoreCameraViewport = true;
        // refractionTex.renderList = depthTex.renderList;
        // refractionTex.refreshRate = 1;

        const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

        // this.water = new Water(scene, depthTex, this.debugSun);

        engine.runRenderLoop(() => {
            // this.water.update();
            this.iceTerrain.update();
            scene.render();
        });

        scene.onBeforeRenderObservable.add(() => {
            const alphaInertia = Math.abs(camera.inertialAlphaOffset);
            const betaInertia = Math.abs(camera.inertialBetaOffset);
            const radiusInertia = Math.abs(camera.inertialRadiusOffset) * 0.01;     // Weighted, so that alpha/beta rotating takes precedence
            let cameraStatus = CameraState.Idle;

            if (alphaInertia > radiusInertia || betaInertia > radiusInertia) {
                cameraStatus = CameraState.Rotating;
            }
            else if (radiusInertia > alphaInertia && radiusInertia > betaInertia) {
                cameraStatus = CameraState.Zooming;
            }

            const camZoomNormalized = 1 - BABYLON.Scalar.InverseLerp(camera.lowerRadiusLimit, camera.upperRadiusLimit, camera.radius);
            if (cameraStatus === CameraState.Zooming) {
                const alphaDelta = BABYLON.Scalar.Lerp(camera.alpha, MaxZoomAlphaTarget, camZoomNormalized);
                const betaDelta = BABYLON.Scalar.Lerp(camera.beta, MaxZoomBetaTarget, camZoomNormalized);
                camera.alpha = BABYLON.Scalar.Lerp(camera.alpha, alphaDelta, 0.1);
                camera.beta = BABYLON.Scalar.Lerp(camera.beta, betaDelta, 0.1);
            }
            if (camZoomNormalized === 1) {
                camera.alpha = MaxZoomAlphaTarget;
                camera.beta = MaxZoomBetaTarget;
            }
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    createCamera(canvas) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            -90 * Deg2Rad,
            70 * Deg2Rad,
            100,
            new BABYLON.Vector3(0, 0, 0)
        );
        cam.lowerRadiusLimit = 70;
        cam.upperRadiusLimit = 200;
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

const toNearest = (value, x) => {
    return Math.round(value / x) * x;
}