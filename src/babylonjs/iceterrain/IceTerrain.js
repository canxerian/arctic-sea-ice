import * as BABYLON from "@babylonjs/core";

import { getElapsedTimeMs } from "../TimeElapsed";
import sceneDataInstance from "../SceneData";

import iceTerrainVertexShader from "./IceTerrain.vertex.glsl";
import iceTerrainFragmentShader from "./IceTerrain.fragment.glsl";

import GlobeModel from "./Globe4.glb";
import seaIceConcLUT from "./SeaIceConcentrationLUT.png";

import { store } from "../../redux/store";
import { GetDataForFilter, FilterOptions } from "../../redux/FilterOptions";

BABYLON.Effect.ShadersStore["iceTerrainVertexShader"] = iceTerrainVertexShader;
BABYLON.Effect.ShadersStore["iceTerrainFragmentShader"] = iceTerrainFragmentShader;

const getImageName = (dataIndex, filter) => {
    try {
        const data = GetDataForFilter(filter);
        const dataItem = data.dataSet[dataIndex];
        const month = (dataItem.month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        return `N_${dataItem.year}${month}_conc_v3.0`;
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
     * @returns {Promise<IceTerrain>}
     */
    static async Create(scene, onLoadProgress) {
        const iceTerrain = new IceTerrain(scene);
        await iceTerrain.init(scene, onLoadProgress);

        return new Promise((resolve) => {
            resolve(iceTerrain);
        });
    }

    /**
     * @param {BABYLON.Vector3} newPosition
     */
    set position(newPosition) {
        this._position = newPosition;

        this.globe.position = newPosition;
        this.globeImagePlane.position = newPosition;
    }

    async init(scene, onLoadProgress) {
        this.scene = scene;

        // Create the material that will reference the shaders we created
        this.material = this.createShaderMaterial();
        this.material.setTexture("_HeightLUT", new BABYLON.Texture(seaIceConcLUT), scene);

        this.updateDataIndex(0);

        const globeMesh = await BABYLON.SceneLoader.ImportMeshAsync("", GlobeModel);

        this.globe = globeMesh.meshes.find(mesh => mesh.name === "Sphere");
        this.globeImagePlane = globeMesh.meshes.find(mesh => mesh.name === "ImagePlane");
        this.globeImagePlane.material = this.material;

        this.parent = new BABYLON.AbstractMesh("IceTerrainParent", scene);
        this.parent.addChild(this.globe);
        this.parent.addChild(this.globeImagePlane);

        const preloadImages = onLoadProgress !== undefined || onLoadProgress !== null;
        if (preloadImages) {
            await this.preloadImages(onLoadProgress);
        }
    }

    async updateDataIndex(index) {
        const imagePath = getImageName(index, store.getState().app.currentFilter);

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
        this.material.setFloat("_DisplaceThreshold", sceneDataInstance.TerrainDisplaceThreshold);
        this.material.setFloat("_DisplaceScale", sceneDataInstance.TerrainDisplaceScale);
        this.material.setInt("_LutThreshold", sceneDataInstance.TerrainLutThreshold);
        this.material.setFloat("_FlattenedPosY", sceneDataInstance.TerrainImageFlattedPosY);
        this.material.setVector4("_IceImageCrop", sceneDataInstance.IceImageCrop);
    }

    createShaderMaterial() {
        return new BABYLON.ShaderMaterial(
            "iceTerrain",
            this.scene,
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
                    "_DisplaceThreshold",
                    "_DisplaceScale",
                    "_LutThreshold",
                    "_CamZoomNormalised",
                    "_FlattenedPosY",
                    "_IceImageCrop",
                ]
            }
        );
    }

    setCameraZoom(normalizedZoom) {
        this.material.setFloat("_CamZoomNormalised", normalizedZoom);
        const scale = smoothstep(0.999, 0.989, normalizedZoom);
        this.globe.scaling = new BABYLON.Vector3(scale, -scale, scale); // negative Y due to .glb coordinate

        // TODO - scale plane to avoid edge artifact
        // this.globeImagePlane.scaling = new BABYLON.Vector3(scale, -scale, scale); // negative Y due to .glb coordinate
    }

    async preloadImages(onLoadProgress) {
        const dataSet = GetDataForFilter(FilterOptions.allArea).dataSet

        const totalImages = dataSet.length;
        let loadedCount = 0;

        const downloadAndInstantiateTexture = (imageName) => {
            return new Promise((resolve, reject) => {
                import("./images/" + imageName + ".png").then((value) => {
                    const imageUrl = value.default;
                    const texture = new BABYLON.Texture(imageUrl, this.scene, null, null, null, () => {
                        this.extentTextures[imageName] = texture;
                        loadedCount++;
                        onLoadProgress({ loaded: loadedCount, total: totalImages });
                        resolve();
                    });
                })
            });
        }

        const cacheTexturePromises = [];

        for (let i = 0; i < dataSet.length; i++) {
            const imageName = getImageName(i, FilterOptions.allArea);
            const promise = downloadAndInstantiateTexture(imageName);
            cacheTexturePromises.push(promise);
        }

        await Promise.allSettled(cacheTexturePromises);
    }
}

const smoothstep = (min, max, value) => {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};