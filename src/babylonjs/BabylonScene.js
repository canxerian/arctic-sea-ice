import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { setCameraZoomNormalised } from "../redux/appSlice";
import { store } from "../redux/store";
import IceTerrain from "./iceterrain/IceTerrain";
import StylisedSky from "./stylisedSky/StylisedSky";

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

        // Gizmo 
        const gizmoManager = new BABYLON.GizmoManager(scene);
        gizmoManager.positionGizmoEnabled = false;

        // const meshes = scene.getNodes().filter((node) => node instanceof BABYLON.AbstractMesh);

        // Ice Terrain
        this.iceTerrain = await IceTerrain.Create(scene);

        // Camera
        const camera = this.createCamera(this.iceTerrain.parent.position);

        // this.createBackground(scene, engine);

        // Skybox
        this.skybox = this.createSkybox(scene);

        // const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(1, 0.2, 0), scene);

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1;

        engine.runRenderLoop(() => {
            this.iceTerrain.update();
            this.skybox.update();
            scene.render();

            if (camera.inertialBetaOffset === 0 && camera.inertialAlphaOffset === 0) {
                camera.alpha -= 0.000007 * scene.deltaTime;
            }
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

            const isOverridingZoom = store.getState().app.isOverridingZoom;
            let camZoomNormalized;
            if (isOverridingZoom) {
                camZoomNormalized = store.getState().app.cameraZoomNormalised;
                camera.radius = BABYLON.Scalar.Lerp(camera.lowerRadiusLimit, camera.upperRadiusLimit, 1 - camZoomNormalized);
            }
            else {
                camZoomNormalized = 1 - BABYLON.Scalar.InverseLerp(camera.lowerRadiusLimit, camera.upperRadiusLimit, camera.radius);

                if (cameraStatus === CameraState.Zooming) {
                    const alphaDelta = BABYLON.Scalar.Lerp(camera.alpha, MaxZoomAlphaTarget, camZoomNormalized);
                    const betaDelta = BABYLON.Scalar.Lerp(camera.beta, MaxZoomBetaTarget, camZoomNormalized);
                    camera.alpha = BABYLON.Scalar.Lerp(camera.alpha, alphaDelta, 0.1);
                    camera.beta = BABYLON.Scalar.Lerp(camera.beta, betaDelta, 0.1);

                    store.dispatch(setCameraZoomNormalised(camZoomNormalized));
                }
            }

            if (camZoomNormalized === 1) {
                camera.alpha = MaxZoomAlphaTarget;
                camera.beta = MaxZoomBetaTarget;
            }

            this.iceTerrain.setCameraZoom(camZoomNormalized);
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    createCamera(targetPosition) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            Math.random() * 360 * Deg2Rad,
            70 * Deg2Rad,
            100,
            targetPosition
        );
        cam.lowerRadiusLimit = 90;
        cam.upperRadiusLimit = 200;
        cam.lowerBetaLimit = 1 * Deg2Rad;
        cam.upperBetaLimit = 135 * Deg2Rad;
        cam.minZ = 0.01;
        cam.maxZ = 1000;
        cam.viewport = new BABYLON.Viewport(-0.3, 0, 1.3, 1);
        cam.attachControl(null, true, true);
        return cam;
    }

    /**
     * 
     * @param {BABYLON.Scene} scene 
     */
    createSkybox(scene) {
        const sky = new StylisedSky(scene);
        return sky;
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