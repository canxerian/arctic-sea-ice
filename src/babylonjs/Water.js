import * as BABYLON from "@babylonjs/core";

import waterVertexShader from "./shaders/Water.vertex.glsl";
import waterFragmentShader from "./shaders/Water.fragment.glsl";
import normalMap1 from "./textures/water_normal_cadhatch_325.jpg";
import normalMap2 from "./textures/water_normal_cadhatch_339.jpg";

import SceneData from "./SceneData.json";
import { Pane } from "tweakpane";

BABYLON.Effect.ShadersStore["waterVertexShader"] = waterVertexShader
BABYLON.Effect.ShadersStore["waterFragmentShader"] = waterFragmentShader

export default class Water {
    /**
     * Instantiate an instance of the Water effect.
     *  * Creates a ground plane
     * @param {BABYLON.Scene} scene 
     * @param {BABYLON.RenderTargetTexture} depthTex 
     * @param {BABYLON.RenderTargetTexture} refractionRTT 
     * @param {Pane} debugPane 
     */
    constructor(scene, depthTex, refractionRTT, debugPane) {
        const size = 100;
        const waterMesh = BABYLON.Mesh.CreateGround("water", size, size, 64, scene);
        waterMesh.position.y += 1;

        this.scene = scene;
        this.startTime = (new Date()).getTime();

        this.waterMaterial = new BABYLON.ShaderMaterial(
            "waterShader",
            scene,
            {
                vertex: "water",
                fragment: "water",
            },
            {
                attributes: ["position", "normal", "uv"],
                samplers: [
                    "_DepthTex",
                    "_RefractionTex",
                    "_NormalMap1",
                ],
                uniforms: [
                    // BabylonJS built-in uniforms
                    "worldViewProjection",
                    "world",        // a matrix used to tranforms from object space to world space

                    // Vert
                    "_Time",
                    "_Frequency",

                    // Frag
                    "_CamMinZ",
                    "_CamMaxZ",
                    "_WaterMaxDepth",
                    "_WaterDeepColour",
                    "_WaterShallowColour",
                    "_WaterSpeed",
                    "_WaterShininess",
                    "_SunDirection",
                    "_NormalBumpScale",
                    "_CamPosition",
                ],
                needAlphaBlending: true
            }
        );

        // Vert uniforms
        this.waterMaterial.setFloat("_Frequency", SceneData.WaterFrequency);
        this.waterMaterial.setFloat("_Amplitude", SceneData.WaterAmplitude);
        this.waterMaterial.setFloat("_Time", 0);

        // Frag uniforms
        this.waterMaterial.setTexture("_DepthTex", depthTex);
        this.waterMaterial.setTexture("_RefractionTex", refractionRTT);
        this.waterMaterial.setTexture("_NormalMap1", new BABYLON.Texture(normalMap1, scene, { samplingMode: BABYLON.Texture.TRILINEAR_SAMPLINGMODE }));
        this.waterMaterial.setFloat("_CamMinZ", scene.activeCamera.minZ);
        this.waterMaterial.setFloat("_CamMaxZ", scene.activeCamera.maxZ);
        this.waterMaterial.setVector3("_CamPosition", scene.activeCamera.position);
        this.waterMaterial.setFloat("_WaterMaxDepth", SceneData.WaterMaxDepth);
        this.waterMaterial.setVector4("_WaterDeepColour", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
        this.waterMaterial.setVector4("_WaterShallowColour", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));
        this.waterMaterial.setFloat("_WaterShininess", SceneData.WaterShininess);
        this.waterMaterial.setFloat("_WaterSpeed", SceneData.WaterSpeed);
        this.waterMaterial.setFloat("_NormalBumpScale", SceneData.WaterNormalBumpScale);

        // Placeholder - replace with actual sun (when I create a procedural skybox)
        this.sun = BABYLON.MeshBuilder.CreateSphere("Sun", { segments: 16, diameter: 1 }, this.scene);
        this.sun.position = new BABYLON.Vector3(0, 7, 0);

        waterMesh.material = this.waterMaterial;

        debugPane.on('change', () => {
            // Vert
            this.waterMaterial.setFloat("_Frequency", SceneData.WaterFrequency);
            this.waterMaterial.setFloat("_Amplitude", SceneData.WaterAmplitude);

            // Frag
            this.waterMaterial.setFloat("_WaterMaxDepth", SceneData.WaterMaxDepth);
            this.waterMaterial.setVector4("_WaterDeepColour", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
            this.waterMaterial.setVector4("_WaterShallowColour", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));
            this.waterMaterial.setFloat("_WaterSpeed", SceneData.WaterSpeed);
            this.waterMaterial.setFloat("_NormalBumpScale", SceneData.WaterNormalBumpScale);
            this.waterMaterial.setFloat("_WaterShininess", SceneData.WaterShininess);
        });
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.waterMaterial.setFloat("_Time", timeMs / 1000);

        this.waterMaterial.setVector3("_SunDirection", this.sun.position);
        this.waterMaterial.setVector3("_CamPosition", this.scene.activeCamera.position);
    }
}