import { Pane } from "tweakpane";
import SavedData from "./SceneData.json";

class SceneData {
    WaterMaxDepth = 50.0;
    WaterShininess = 1.0;
    WaterSpecular = 1.0;
    WaterNormalMapSpeed = 1.0;
    WaterNormalMapSize = 1.0;
    WaterColourShallow = { r: 0, g: 0, b: 0 };
    WaterColourDeep = { r: 0, g: 0, b: 0 };
    FogStart = 50.0;
    FogEnd = 100.0;
    FogColour = {r: 1, g: 1, b: 1}

    constructor() {
        this.pane = new Pane({ title: "Debug Menu" });
        this.pane.addInput(this, "WaterMaxDepth", { min: 0.0, max: 40.0 });
        this.pane.addInput(this, "WaterSpecular", { min: 0.0, max: 5.0 });
        this.pane.addInput(this, "WaterShininess", { min: 0.0, max: 100.0 });
        this.pane.addInput(this, "WaterNormalMapSpeed", { min: 0.0, max: 2.0 });
        this.pane.addInput(this, "WaterNormalMapSize", { min: 0.0, max: 10.0 });
        this.pane.addInput(this, "WaterColourShallow", { color: { type: "float" } });
        this.pane.addInput(this, "WaterColourDeep", { color: { type: "float" } });
        this.pane.addInput(this, "FogStart", {min: 0.0, max: 1000.0});
        this.pane.addInput(this, "FogEnd", {min: 50.0, max: 1000.0});
        this.pane.addInput(this, "FogColour", { color: { type: "float" } });

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

export default new SceneData();