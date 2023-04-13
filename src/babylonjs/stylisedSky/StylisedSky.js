import * as BABYLON from "@babylonjs/core";

import vertexShader from "./StylisedSky.vertex.glsl";
import fragmentShader from "./StylisedSky.fragment.glsl";
import sceneDataInstance from "../SceneData";

BABYLON.Effect.ShadersStore["stylisedSkyVertexShader"] = vertexShader;
BABYLON.Effect.ShadersStore["stylisedSkyFragmentShader"] = fragmentShader;

export default class StylisedSky {
    /**
     * 
     * @param {BABYLON.Scene} scene 
     */
    constructor(scene) {
        this.sphere = BABYLON.MeshBuilder.CreateSphere("StylisedSky", {
            diameter: 620,
            segments: 64,
        }, scene);

        this.material = this.createMaterial();
        this.sphere.material = this.material;
        this.scene = scene;
    }

    /**
     * Creates the shader material for the sky sphere
     * @returns {BABYLON.ShaderMaterial}
     */
    createMaterial(scene) {
        const mat = new BABYLON.ShaderMaterial("StylisedSky",
            scene,
            {
                vertex: "stylisedSky",
                fragment: "stylisedSky",
            },
            {
                samplers: [
                ],
                attributes: [
                    "position",
                    "uv"
                ],
                uniforms: [
                    "worldViewProjection",
                    "world",

                    "_CamPos",
                    "_Colour1",
                    "_Colour2"
                ]
            }
        );

        mat.backFaceCulling = false;
        return mat;
    }

    update() {
        this.material.setColor3("_Colour1", sceneDataInstance.Skybox.Colour1);
        this.material.setColor3("_Colour2", sceneDataInstance.Skybox.Colour2);
        this.material.setVector3("_CamPos", this.scene.activeCamera.position);
    }
}