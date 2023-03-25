import { Pane } from "tweakpane";
import SavedData from "./SceneData.json";

class SceneData {
    WaterMaxDepth = 50.0;
    WaterShininess = 1.0;
    WaterSpecular = 1.0;
    WaterSpecularColour = { r: 0, g: 0, b: 0 };
    WaterNormalMapSpeed = 1.0;
    WaterNormalMapSize = 1.0;
    WaterColourShallow = { r: 0, g: 0, b: 0 };
    WaterColourDeep = { r: 0, g: 0, b: 0 };
    FogDensity = 0.01;
    FogColour = { r: 1, g: 1, b: 1 };
    TerrainDisplaceThreshold = 0.86;
    TerrainDisplaceScale = 1.0;
    TerrainLutThreshold = 0;
    TerrainImageFlattedPosY = 0;
    IceImageCrop = { x: 0.0, y: 0.0, z: 1.0, w: 1.0 };

    constructor() {
        this.pane = new Pane({ title: "Debug Menu" });
        this.pane.addInput(this, "WaterMaxDepth", { min: 0.0, max: 40.0 });
        this.pane.addInput(this, "WaterSpecular", { min: 0.0, max: 5.0 });
        this.pane.addInput(this, "WaterSpecularColour", { color: { type: "float" } });
        this.pane.addInput(this, "WaterShininess", { min: 0.0, max: 100.0 });
        this.pane.addInput(this, "WaterNormalMapSpeed", { min: 0.0, max: 2.0 });
        this.pane.addInput(this, "WaterNormalMapSize", { min: 0.0, max: 10.0 });
        this.pane.addInput(this, "WaterColourShallow", { color: { type: "float" } });
        this.pane.addInput(this, "WaterColourDeep", { color: { type: "float" } });
        this.pane.addInput(this, "FogDensity", { min: 0.0, max: 0.1 });
        this.pane.addInput(this, "FogColour", { color: { type: "float" } });
        this.pane.addInput(this, "TerrainDisplaceThreshold", { min: 0.0, max: 1.0 });
        this.pane.addInput(this, "TerrainDisplaceScale", { min: 0.0, max: 10.0 });
        this.pane.addInput(this, "TerrainLutThreshold", { min: 0, max: 18, step: 1 });
        this.pane.addInput(this, "TerrainImageFlattedPosY", { min: 0, max: 50, step: 1 });
        this.pane.addInput(this, "IceImageCrop", {
            x: { min: 0, max: 1, step: 0.01 },
            y: { min: 0, max: 1, step: 0.01 },
            z: { min: 0, max: 1, step: 0.01 },
            w: { min: 0, max: 1, step: 0.01 },
        });
        this.pane.expanded = false;

        this.pane.importPreset(SavedData);

        const saveBtn = this.pane.addButton({ title: "Save", label: "Save" });
        saveBtn.on("click", this.onClickSave);
    }

    onClickSave = async () => {
        const preset = this.pane.exportPreset();
        const opts = {
            suggestedName: "SceneData",
            excludeAcceptAllOption: true,
            types: [{
                description: 'JSON',
                accept: { 'application/json': ['.json'] },
            }],
        };
        const saveFile = await window.showSaveFilePicker(opts);
        const writable = await saveFile.createWritable();
        await writable.write(JSON.stringify(preset));
        await writable.close();
    }
}

/**
 * @type {SceneData}
 */
let sceneDataInstance;
if (!sceneDataInstance) {
    sceneDataInstance = new SceneData();
}

export default sceneDataInstance;