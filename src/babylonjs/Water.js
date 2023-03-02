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

                    // Vert
                    "_Time",
                    "_Frequency",

                    // Frag
                    "_CamMinZ",
                    "_CamMaxZ",
                    "_WaterMaxDepth",
                    "_WaterDeepColour",
                    "_WaterShallowColour",
                    "_WaterSpeed"
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
        this.waterMaterial.setTexture("_NormalMap1", new BABYLON.Texture(normalMap1, scene));
        this.waterMaterial.setFloat("_CamMinZ", scene.activeCamera.minZ);
        this.waterMaterial.setFloat("_CamMaxZ", scene.activeCamera.maxZ);
        this.waterMaterial.setFloat("_WaterMaxDepth", SceneData.WaterMaxDepth);
        this.waterMaterial.setVector4("_WaterDeepColour", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
        this.waterMaterial.setVector4("_WaterShallowColour", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));
        this.waterMaterial.setVector2("_WaterSpeed", SceneData.WaterSpeed);

        waterMesh.material = this.waterMaterial;

        debugPane.on('change', () => {
            // Vert
            this.waterMaterial.setFloat("_Frequency", SceneData.WaterFrequency);
            this.waterMaterial.setFloat("_Amplitude", SceneData.WaterAmplitude);

            // Frag
            this.waterMaterial.setFloat("_WaterMaxDepth", SceneData.WaterMaxDepth);
            this.waterMaterial.setVector4("_WaterDeepColour", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
            this.waterMaterial.setVector4("_WaterShallowColour", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));
            this.waterMaterial.setVector2("_WaterSpeed", SceneData.WaterSpeed);
        });
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.waterMaterial.setFloat("_Time", timeMs / 1000);
    }
}