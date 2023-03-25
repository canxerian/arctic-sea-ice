import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import envTexture from "./textures/kloppenheim_02_puresky_4k.env";
import IceTerrain from "./iceterrain/IceTerrain";

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
        gizmoManager.positionGizmoEnabled = true;

        // const meshes = scene.getNodes().filter((node) => node instanceof BABYLON.AbstractMesh);

        // Ice Terrain
        this.iceTerrain = await IceTerrain.Create(scene);

        // Camera
        const camera = this.createCamera(this.iceTerrain.parent.position);

        this.createBackground(scene, engine);

        // Skybox
        // this.createSkybox(scene);

        // const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1;

        engine.runRenderLoop(() => {
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

            this.iceTerrain.setCameraZoom(camZoomNormalized);
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    createCamera(targetPosition) {
        const cam = new BABYLON.ArcRotateCamera(
            "Main Camera",
            -90 * Deg2Rad,
            70 * Deg2Rad,
            100,
            targetPosition
        );
        cam.lowerRadiusLimit = 70;
        cam.upperRadiusLimit = 200;
        cam.lowerBetaLimit = 1 * Deg2Rad;
        cam.upperBetaLimit = 80 * Deg2Rad;
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
        scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(envTexture, scene);
        scene.createDefaultSkybox(scene.environmentTexture, true, 10 * scene.activeCamera.maxZ);
        scene.imageProcessingConfiguration.toneMappingEnabled = true;
        scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD;
    }

    createBackground(scene, engine) {
        // Create a render target.
        const rtt = new BABYLON.RenderTargetTexture("", 512, scene)

        // Create the background from it
        const background = new BABYLON.Layer("background", null, scene);
        background.isBackground = true;
        background.texture = rtt;

        // Create the background effect.
        const renderImage = new BABYLON.EffectWrapper({
            engine: engine,
            fragmentShader: `
            vec3 col1 = vec3(0.14, 0.18, 0.24);
            vec3 col2 = vec3(0.24, 0.21, 0.27);

            varying vec2 vUV;

            void main(void) {
                float t = clamp(vUV.x + vUV.y, 0.0, 1.0);
                vec3 col = mix(col1, col2, t);
                gl_FragColor = vec4(col, 1.0);
            }`
        });

        // When the effect has been ready,
        // Create the effect render and change which effects will be renderered
        renderImage.effect.executeWhenCompiled(() => {
            // Render the effect in the RTT.
            const renderer = new BABYLON.EffectRenderer(engine);
            renderer.render(renderImage, rtt);
        });
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