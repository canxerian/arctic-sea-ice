import { useSelector } from "react-redux";
import BabylonScene from "../babylonjs/BabylonScene";

import "./BabylonCanvas.scss";

const { useRef, useEffect } = require("react")

const BabylonCanvas = ({ onLoadProgress }) => {
    const canvasRef = useRef();
    const babylonSceneRef = useRef();
    const appState = useSelector(state => state.app);

    useEffect(() => {
        if (!babylonSceneRef.current) {
            babylonSceneRef.current = new BabylonScene(canvasRef.current, onLoadProgress);
        }
        babylonSceneRef.current.setActiveIceIndex(appState.activeIceDataIndex);
    }, [appState.activeIceDataIndex, appState.currentFilter]);

    return (
        <canvas ref={canvasRef} id="babylon-canvas" />
    )
}

export default BabylonCanvas;