import * as BABYLON from "@babylonjs/core";
import normalMap1 from "../textures/water_normal_cadhatch_325.jpg";

import waterVertexShader from "./WaterTest.vertex.glsl";
import waterFragmentShader from "./WaterTest.fragment.glsl";

import SceneData from "../SceneData.json";

BABYLON.Effect.ShadersStore["waterTestVertexShader"] = waterVertexShader
BABYLON.Effect.ShadersStore["waterTestFragmentShader"] = waterFragmentShader

export default class WaterTest {
    /**
     *
     * @param {BABYLON.Scene} scene
     */
    constructor(scene, depthTex) {
        const size = 1000;
        const subDivisions = 128;
        this.scene = scene;
        this.startTime = (new Date()).getTime();
        this.mesh = BABYLON.Mesh.CreateGround("waterTest", size, size, subDivisions, scene);
        this.mesh.position.y += 1;
        this.material = new BABYLON.ShaderMaterial(
            "waterTestShader",
            scene,
            {
                vertex: "waterTest",
                fragment: "waterTest",
            },
            {
                attributes: [
                    "position",
                    "normal",
                    "uv"
                ],
                samplers: [
                    "_DepthTex",
                    "_NormalMap",
                ],
                uniforms: [
                    /** BabylonJS built-in https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/introToShaders#built-in-inputs */
                    "worldViewProjection",
                    "world",

                    /** Our uniforms */
                    "_Time",
                    "_SunPosition",
                    "_CamPosition",
                    "_Shininess",
                    "_WaterMaxDepth",
                    "_WaterColourShallow",
                    "_WaterColourDeep",
                    "_CamNearFar",
                ],
                needAlphaBlending: true
            }
        );
        this.material.setTexture("_DepthTex", depthTex);
        this.material.setTexture("_NormalMap", new BABYLON.Texture(normalMap1, scene, { samplingMode: BABYLON.Texture.TRILINEAR_SAMPLINGMODE }));
        this.material.setVector2("_CamNearFar", new BABYLON.Vector2(scene.activeCamera.minZ, scene.activeCamera.maxZ));

        this.debugSun = BABYLON.MeshBuilder.CreateSphere("Sun", { segments: 16, diameter: 1 }, this.scene);
        this.debugSun.position = new BABYLON.Vector3(3, 15, 200);

        this.mesh.material = this.material;
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.material.setFloat("_Time", timeMs / 1000);
        this.material.setVector3("_SunPosition", this.debugSun.position);
        this.material.setVector3("_CamPosition", this.scene.activeCamera.position);
        this.material.setFloat("_Shininess", SceneData.WaterShininess);
        this.material.setFloat("_WaterMaxDepth", SceneData.WaterMaxDepth);
        this.material.setColor3("_WaterColourShallow", SceneData.WaterColourShallow);
        this.material.setColor3("_WaterColourDeep", SceneData.WaterColourDeep);
    }
}
