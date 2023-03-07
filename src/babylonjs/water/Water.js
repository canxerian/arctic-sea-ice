import * as BABYLON from "@babylonjs/core";
import normalMap1 from "./waternormals.jpg";

import waterVertexShader from "./Water.vertex.glsl";
import waterFragmentShader from "./Water.fragment.glsl";

import SceneData from "../SceneData";

BABYLON.Effect.ShadersStore["waterVertexShader"] = waterVertexShader
BABYLON.Effect.ShadersStore["waterFragmentShader"] = waterFragmentShader

export default class Water {
    /**
     * @param {BABYLON.Scene} scene
     * @param {BABYLON.Texture} depthTex
     * @param {BABYLON.Node} sun
     */
    constructor(scene, depthTex, sun) {
        const size = 1000;
        const subDivisions = 128;
        this.scene = scene;
        this.sun = sun;
        this.startTime = (new Date()).getTime();
        this.mesh = BABYLON.Mesh.CreateGround("water", size, size, subDivisions, scene);
        this.mesh.position.y += 1;
        this.material = new BABYLON.ShaderMaterial(
            "waterShader",
            scene,
            {
                vertex: "water",
                fragment: "water",
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
                    "_RefractionTex",
                ],
                uniforms: [
                    /** BabylonJS built-in https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/introToShaders#built-in-inputs */
                    "worldViewProjection",
                    "world",

                    /** Our uniforms */
                    "_SunPosition",
                    "_CamPosition",
                    "_Shininess",
                    "_Specular",
                    "_SpecularColour",
                    "_MaxDepth",
                    "_NormalMapSpeed",
                    "_NormalMapSize",
                    "_ColourShallow",
                    "_ColourDeep",
                    "_FogDensity",
                    "_FogColour",
                ],
                needAlphaBlending: true
            }
        );
        this.material.setTexture("_DepthTex", depthTex);
        this.material.setTexture("_NormalMap", new BABYLON.Texture(normalMap1, scene, { samplingMode: BABYLON.Texture.TRILINEAR_SAMPLINGMODE }));
        this.material.setVector2("_CamNearFar", new BABYLON.Vector2(scene.activeCamera.minZ, scene.activeCamera.maxZ));

        this.mesh.material = this.material;
    }

    update() {
        const timeMs = (new Date()).getTime() - this.startTime;
        this.material.setFloat("_Time", timeMs / 1000);
        this.material.setVector3("_SunPosition", this.sun.position);
        this.material.setVector3("_CamPosition", this.scene.activeCamera.position);
        this.material.setFloat("_Shininess", SceneData.WaterShininess);
        this.material.setFloat("_Specular", SceneData.WaterSpecular);
        this.material.setColor3("_SpecularColour", SceneData.WaterSpecularColour);
        this.material.setFloat("_MaxDepth", SceneData.WaterMaxDepth);
        this.material.setFloat("_NormalMapSpeed", SceneData.WaterNormalMapSpeed);
        this.material.setFloat("_NormalMapSize", SceneData.WaterNormalMapSize);
        this.material.setColor3("_ColourShallow", SceneData.WaterColourShallow);
        this.material.setColor3("_ColourDeep", SceneData.WaterColourDeep);
        this.material.setFloat("_FogDensity", SceneData.FogDensity);
        this.material.setColor3("_FogColour", SceneData.FogColour);
    }
}
