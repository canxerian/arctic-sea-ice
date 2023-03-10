import * as BABYLON from "@babylonjs/core";

import iceTerrainVertexShader from "./IceTerrain.vertex.glsl";
import iceTerrainFragmentShader from "./IceTerrain.fragment.glsl";

import ArcticIceData from "../../data/ArcticIceData.json";

import seaIceConcLUT from "./SeaIceConcentrationLUT.png";

import { getElapsedTimeMs } from "../TimeElapsed";
import sceneDataInstance from "../SceneData";

BABYLON.Effect.ShadersStore["iceTerrainVertexShader"] = iceTerrainVertexShader;
BABYLON.Effect.ShadersStore["iceTerrainFragmentShader"] = iceTerrainFragmentShader;

const getImageName = (dataIndex) => {
    const data = ArcticIceData.minMaxAreaByYear[dataIndex];
    const month = (data.month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    return `N_${data.year}${month}_conc_v3.0`;
}

/**
 * Component for generating a terrain mesh that uses NSIDC ice extent image to
 * drive vertex displacement
 */
export default class IceTerrain {
    extentTextures = {};
    /**
     *
     * @param {BABYLON.Scene} scene
     * @param {BABYLON.Node} sun
     */
    constructor(scene, sun) {
        // Create a plane
        // const size = 100.0;
        const subDivisions = 512;
        this.scene = scene;
        this.sun = sun;
        this.mesh = BABYLON.Mesh.CreateGround("iceTerrain", 292 / 3.0, 446 / 3.0, subDivisions, scene);
        this.mesh.position.y = 5;

        // Create the material that will reference the shaders we created
        this.material = new BABYLON.ShaderMaterial(
            "iceTerrain",
            scene,
            {
                vertex: "iceTerrain",
                fragment: "iceTerrain",
            },
            {
                samplers: [
                    "_IceExtentImg",
                    "_HeightLUT",
                ],
                attributes: [
                    "position",
                    "uv"
                ],
                uniforms: [
                    "worldViewProjection",
                    "world",

                    "_Time",
                    "_SunPosition",
                    "_DisplaceThreshold",
                    "_DisplaceScale",
                ]
            }
        );
        this.material.setTexture("_HeightLUT", new BABYLON.Texture(seaIceConcLUT), scene);

        this.mesh.material = this.material;
    }

    updateDataIndex(index) {
        const imagePath = getImageName(index);

        if (this.extentTextures[imagePath]) {
            this.material.setTexture("_IceExtentImg", this.extentTextures[imagePath]);
        }
        else {
            import("./images/" + imagePath + ".png").then(image => {
                this.extentTextures[imagePath] = new BABYLON.Texture(image.default, this.scene, null, null, null, () => {
                    this.material.setTexture("_IceExtentImg", this.extentTextures[imagePath]);
                });
            });
        }
        // const imgIndex = index % 3;
        // if (imgIndex === 0) {
        //     this.material.setTexture("_IceExtentImg", this.extentImg1);
        // }
        // else if (imgIndex === 1) {
        //     this.material.setTexture("_IceExtentImg", this.extentImg2);
        // }
        // else {
        //     this.material.setTexture("_IceExtentImg", this.extentImg3);
        // }
    }

    update() {
        const timeMs = getElapsedTimeMs();
        this.material.setFloat("_Time", timeMs);
        this.material.setVector3("_SunPosition", this.sun.position);
        this.material.setFloat("_DisplaceThreshold", sceneDataInstance.TerrainDisplaceThreshold);
        this.material.setFloat("_DisplaceScale", sceneDataInstance.TerrainDisplaceScale);
    }
}