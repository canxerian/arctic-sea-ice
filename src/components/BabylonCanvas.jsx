import * as BABYLON from "@babylonjs/core";
import BabylonScene from "../babylonjs/BabylonScene";

import "./BabylonCanvas.scss";

const { useRef, useEffect } = require("react")

const BabylonCanvas = () => {
    const canvasRef = useRef();
    const babylonSceneRef = useRef();

    useEffect(() => {
        if (babylonSceneRef.current) {
            return;
        }

        babylonSceneRef.current = new BabylonScene(canvasRef.current);
    });

    return (
        <canvas ref={canvasRef} id="babylon-canvas" />
    )
}

export default BabylonCanvas;