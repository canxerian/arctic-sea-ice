import * as BABYLON from "@babylonjs/core";

import waterVertexShader from "./shaders/Water.vertex.glsl";
import waterFragmentShader from "./shaders/Water.fragment.glsl";

BABYLON.Effect.ShadersStore["waterVertexShader"] = waterVertexShader
BABYLON.Effect.ShadersStore["waterFragmentShader"] = waterFragmentShader

export default class Water {
    constructor(scene, depthTex, refractionRTT) {
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
                uniforms: ["worldViewProjection", "time"]
            }
        );
        
        this.waterMaterial.setTexture("depthTex", depthTex);
        this.waterMaterial.setTexture("refractionSampler", refractionRTT);
        this.waterMaterial.setFloat("camMinZ", scene.activeCamera.minZ);
        this.waterMaterial.setFloat("camMaxZ", scene.activeCamera.maxZ);
        this.waterMaterial.setFloat("time", 0);
        this.waterMaterial.setFloat("wNoiseScale", 6.0);
        this.waterMaterial.setFloat("wNoiseOffset", 0.01);
        this.waterMaterial.setFloat("fNoiseScale", 10.0);
        this.waterMaterial.setFloat("maxDepth", 5.0);
        this.waterMaterial.setVector4("wDeepColor", new BABYLON.Vector4(0.0,0.2,0.5,0.8));
        this.waterMaterial.setVector4("wShallowColor", new BABYLON.Vector4(0.3,0.4,0.8,0.5));
       


        waterMesh.material = this.waterMaterial;
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.waterMaterial.setFloat("time", timeMs / 1000);
    }
}