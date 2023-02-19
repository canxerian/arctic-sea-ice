import * as BABYLON from "@babylonjs/core";

import waterVertexShader from "./shaders/Water.vertex.glsl";
import waterFragmentShader from "./shaders/Water.fragment.glsl";

BABYLON.Effect.ShadersStore["waterVertexShader"] = waterVertexShader
BABYLON.Effect.ShadersStore["waterFragmentShader"] = waterFragmentShader

export default class Water {
    constructor(scene) {
        const waterMesh = BABYLON.Mesh.CreateGround("water", 45, 45, 64, scene);
        waterMesh.position.y += 1;

        const waterMaterial = new BABYLON.ShaderMaterial(
            "waterShader",
            scene,
            {
                vertex: "water",
                fragment: "water",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection"]
            });

        waterMesh.material = waterMaterial;
    }
}