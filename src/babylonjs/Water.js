import * as BABYLON from "@babylonjs/core";

import waterVertexShader from "./shaders/Water.vertex.glsl";
import waterFragmentShader from "./shaders/Water.fragment.glsl";

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
        const waterMesh = BABYLON.Mesh.CreateGround("water", 45, 45, 64, scene);
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
                uniforms: [
                    // Vert
                    "time",
                    "frequency",

                    // Frag
                    "depthTex",
                    "camMinZ",
                    "camMaxZ",
                    "worldViewProjection",
                    "maxDepth",
                    "wDeepColor",
                    "wShallowColor"
                ]
            }
        );

        // Vert uniforms
        this.waterMaterial.setFloat("frequency", SceneData.WaterFrequency);
        this.waterMaterial.setFloat("amplitude", SceneData.WaterAmplitude);
        this.waterMaterial.setFloat("time", 0);

        // Frag uniforms
        this.waterMaterial.setTexture("depthTex", depthTex);
        this.waterMaterial.setTexture("refractionSampler", refractionRTT);
        this.waterMaterial.setFloat("camMinZ", scene.activeCamera.minZ);
        this.waterMaterial.setFloat("camMaxZ", scene.activeCamera.maxZ);
        this.waterMaterial.setFloat("wNoiseScale", 6.0);
        this.waterMaterial.setFloat("wNoiseOffset", 0.01);
        this.waterMaterial.setFloat("fNoiseScale", 10.0);
        this.waterMaterial.setFloat("maxDepth", SceneData.WaterMaxDepth);
        this.waterMaterial.setFloat("waterStrength", SceneData.WaterStrength);
        this.waterMaterial.setVector4("wDeepColor", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
        this.waterMaterial.setVector4("wShallowColor", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));

        waterMesh.material = this.waterMaterial;

        debugPane.on('change', (ev) => {
            // Vert
            this.waterMaterial.setFloat("frequency", SceneData.WaterFrequency);
            this.waterMaterial.setFloat("amplitude", SceneData.WaterAmplitude);

            // Frag
            this.waterMaterial.setFloat("maxDepth", SceneData.WaterMaxDepth);
            this.waterMaterial.setFloat("maxDepth", SceneData.WaterStrength);
            this.waterMaterial.setVector4("wDeepColor", new BABYLON.Vector4(SceneData.WaterColourDeep.r, SceneData.WaterColourDeep.g, SceneData.WaterColourDeep.b, SceneData.WaterColourDeep.a));
            this.waterMaterial.setVector4("wShallowColor", new BABYLON.Vector4(SceneData.WaterColourShallow.r, SceneData.WaterColourShallow.g, SceneData.WaterColourShallow.b, SceneData.WaterColourShallow.a));
        });
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.waterMaterial.setFloat("time", timeMs / 1000);
    }
}