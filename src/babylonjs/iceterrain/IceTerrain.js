import * as BABYLON from "@babylonjs/core";

import sampleImage from "./N_198001_conc_v3.0.png";

/**
 * Component for generating a terrain mesh that uses NSIDC ice extent image to
 * drive vertex displacement
 */
export default class IceTerrain {
    /**
     * 
     * @param {BABYLON.Scene} scene 
     */
    constructor(scene) {
        // Create a plane
        const size = 100.0;
        const subDivisions = 128;
        this.mesh = BABYLON.Mesh.CreateGround("iceTerrain", size, size, subDivisions, scene);
    this.mesh.position.y = 5;
    }
}