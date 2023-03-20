import * as BABYLON from "@babylonjs/core";

import { getElapsedTimeMs } from "../TimeElapsed";
import sceneDataInstance from "../SceneData";

import iceTerrainVertexShader from "./IceTerrain.vertex.glsl";
import iceTerrainFragmentShader from "./IceTerrain.fragment.glsl";

import GlobeModel from "../models/Globe3.babylon";
import ArcticIceData from "../../data/ArcticIceData.json";
import seaIceConcLUT from "./SeaIceConcentrationLUT.png";

BABYLON.Effect.ShadersStore["iceTerrainVertexShader"] = iceTerrainVertexShader;
BABYLON.Effect.ShadersStore["iceTerrainFragmentShader"] = iceTerrainFragmentShader;

const getImageName = (dataIndex) => {
    try {
        const data = ArcticIceData.data[dataIndex];
        const month = (data.month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        return `N_${data.year}${month}_conc_v3.0`;
    }
    catch (e) {
        console.error(dataIndex);
    }
}

/**
 * Component for generating a terrain mesh that uses NSIDC ice extent image to
 * drive vertex displacement
 */
export default class IceTerrain {
    extentTextures = {};

    /**
     * Creates an instance of IceTerrain
     * 
     * @param {*} scene 
     * @param {*} sun 
     * @returns {Promise<IceTerrain>}
     */
    static async Create(scene, sun) {
        const iceTerrain = new IceTerrain(scene, sun);
        await iceTerrain.init(scene, sun);

        return new Promise((resolve) => {
            resolve(iceTerrain);
        });
    }

    /**
     * @param {BABYLON.Vector3} newPosition
     */
    set position(newPosition) {
        console.log("set new pos", newPosition)
        this._position = newPosition;

        this.globe.position = newPosition;
        this.globeImagePlane.position = newPosition;
    }

    async init(scene, sun) {
        const subDivisions = 512;
        const scale = 0.5;
        this.scene = scene;
        this.sun = sun;

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
                    "_LutThreshold",
                    "_CamZoomNormalised"
                ]
            }
        );
        this.material.setTexture("_HeightLUT", new BABYLON.Texture(seaIceConcLUT), scene);

        this.updateDataIndex(0);

        const globeMesh = await BABYLON.SceneLoader.ImportMeshAsync("", GlobeModel);
        this.globe = globeMesh.meshes[0];
        this.globeImagePlane = globeMesh.meshes[1];
        this.globeImagePlane.material = this.material;

        this.parent = new BABYLON.AbstractMesh("IceTerrainParent", scene);
        this.parent.addChild(this.globe);
        this.parent.addChild(this.globeImagePlane);
    }

    async updateDataIndex(index) {
        const imagePath = getImageName(index);

        if (this.extentTextures[imagePath]) {
            this.material.setTexture("_IceExtentImg", this.extentTextures[imagePath]);
        }
        else {
            try {
                const image = await import("./images/" + imagePath + ".png");

                this.extentTextures[imagePath] = new BABYLON.Texture(image.default, this.scene, null, null, null, () => {
                    this.material.setTexture("_IceExtentImg", this.extentTextures[imagePath]);
                });
            }
            catch (e) {
                console.error("Failed to load", imagePath, e);
            }
        }
    }

    update() {
        const timeMs = getElapsedTimeMs();
        this.material.setFloat("_Time", timeMs);
        this.material.setVector3("_SunPosition", this.sun.position);
        this.material.setFloat("_DisplaceThreshold", sceneDataInstance.TerrainDisplaceThreshold);
        this.material.setFloat("_DisplaceScale", sceneDataInstance.TerrainDisplaceScale);
        this.material.setInt("_LutThreshold", sceneDataInstance.TerrainLutThreshold);
    }

    setCameraZoom(normalizedZoom) {
        this.material.setFloat("_CamZoomNormalised", normalizedZoom);
    }
}