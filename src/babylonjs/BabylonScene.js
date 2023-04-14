import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { setCameraZoomNormalised } from "../redux/appSlice";
import { store } from "../redux/store";
import IceTerrain from "./iceterrain/IceTerrain";
import StylisedSky from "./stylisedSky/StylisedSky";
import { mobileWidth } from "../hooks/useMediaScreen";

const Deg2Rad = Math.PI / 180;

const CameraState = {
    Idle: 0,
    Rotating: 1,
    Zooming: 2
};

const CameraInitZoom = {
    Alpha: Math.random() * 360 * Deg2Rad,
    Beta: 55 * Deg2Rad,
    Radius: 120,
};

const CamMaxZoom = {
    Alpha: 90 * Deg2Rad,
    Beta: 1 * Deg2Rad,
};

export default class BabylonScene {
    constructor(canvas, onLoadProgress) {
        this.initialise(canvas, onLoadProgress);
    }

    async initialise(canvas, onLoadProgress) {
        const engine = new BABYLON.Engine(canvas);
        const scene = new BABYLON.Scene(engine);

        // Gizmo 
        const gizmoManager = new BABYLON.GizmoManager(scene);
        gizmoManager.positionGizmoEnabled = false;

        // const meshes = scene.getNodes().filter((node) => node instanceof BABYLON.AbstractMesh);

        // Ice Terrain
        this.iceTerrain = await IceTerrain.Create(scene, onLoadProgress);

        // Camera
        this.camera = this.createCamera(this.iceTerrain.parent.position);

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

            // Rotate the camera.. slowly
            if (this.camera.inertialBetaOffset === 0 && this.camera.inertialAlphaOffset === 0) {
                this.camera.alpha -= 0.000007 * scene.deltaTime;
            }
        });

        scene.onBeforeRenderObservable.add(() => {
            const alphaInertia = Math.abs(this.camera.inertialAlphaOffset);
            const betaInertia = Math.abs(this.camera.inertialBetaOffset);
            const radiusInertia = Math.abs(this.camera.inertialRadiusOffset) * 0.01;     // Weighted, so that alpha/beta rotating takes precedence
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
                this.camera.radius = BABYLON.Scalar.Lerp(this.camera.lowerRadiusLimit, this.camera.upperRadiusLimit, 1 - camZoomNormalized);
            }
            else {
                camZoomNormalized = this.getCameraZoomNormalised();
            }

            if (cameraStatus === CameraState.Zooming || isOverridingZoom) {
                const targetAlpha = BABYLON.Scalar.Lerp(this.camera.alpha, CamMaxZoom.Alpha, camZoomNormalized);
                const targetBeta = BABYLON.Scalar.Lerp(CameraInitZoom.Beta, CamMaxZoom.Beta, camZoomNormalized);

                const alphaDelta = BABYLON.Scalar.Lerp(this.camera.alpha, targetAlpha, camZoomNormalized);
                const betaDelta = BABYLON.Scalar.Lerp(this.camera.beta, targetBeta, camZoomNormalized);
                this.camera.alpha = BABYLON.Scalar.Lerp(this.camera.alpha, alphaDelta, 0.1);
                this.camera.beta = BABYLON.Scalar.Lerp(this.camera.beta, betaDelta, 0.1);

                store.dispatch(setCameraZoomNormalised(camZoomNormalized));
            }

            if (camZoomNormalized === 1) {
                this.camera.alpha = CamMaxZoom.Alpha;
                this.camera.beta = CamMaxZoom.Beta;
            }

            this.iceTerrain.setCameraZoom(camZoomNormalized);
        });

        this.updateViewport();

        window.addEventListener("resize", (e) => {
            engine.resize();
            this.updateViewport();
        });

        store.dispatch(setCameraZoomNormalised(this.getCameraZoomNormalised()));
    }

    createCamera(targetPosition) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            CameraInitZoom.Alpha,
            CameraInitZoom.Beta,
            CameraInitZoom.Radius,
            targetPosition
        );
        cam.lowerRadiusLimit = 100;
        cam.upperRadiusLimit = 200;
        cam.lowerBetaLimit = 1 * Deg2Rad;
        cam.upperBetaLimit = 135 * Deg2Rad;
        cam.minZ = 0.01;
        cam.maxZ = 1000;
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

    updateViewport() {
        if (window.innerWidth > mobileWidth) {
            this.camera.viewport = new BABYLON.Viewport(-0.33, -0.05, 1.35, 1.05);
            this.camera.lowerRadiusLimit = 100;
            this.camera.upperRadiusLimit = 200;
        }
        else {
            this.camera.viewport = new BABYLON.Viewport(0, 0, 1, 1.2);

            // when width is 768, lower radius = 140
            // scale down from there.
            const mobileWidthMin = 320;
            const lowerRadiusMin = 200;     // For phones with mobileWidthMin width
            const lowerRadiusMax = 160;     // For phones with mobileWidth width
            const t = BABYLON.Scalar.InverseLerp(mobileWidthMin, mobileWidth, window.innerWidth);
            this.camera.lowerRadiusLimit = BABYLON.Scalar.Lerp(lowerRadiusMin, lowerRadiusMax, t);
            this.camera.upperRadiusLimit = 300;
        }
    }

    getCameraZoomNormalised() {
        return 1 - BABYLON.Scalar.InverseLerp(this.camera.lowerRadiusLimit, this.camera.upperRadiusLimit, this.camera.radius);
    }
}