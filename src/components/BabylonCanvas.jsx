import { useSelector } from "react-redux";
import BabylonScene from "../babylonjs/BabylonScene";

import "./BabylonCanvas.scss";

const { useRef, useEffect } = require("react")

const BabylonCanvas = () => {
    const canvasRef = useRef();
    const babylonSceneRef = useRef();
    const activeIceDataIndex = useSelector(state => state.app.activeIceDataIndex);

    useEffect(() => {
        if (!babylonSceneRef.current) {
            babylonSceneRef.current = new BabylonScene(canvasRef.current);
        }
        babylonSceneRef.current.setActiveIceIndex(activeIceDataIndex);
    }, [activeIceDataIndex]);

    return (
        <canvas ref={canvasRef} id="babylon-canvas" />
    )
}

export default BabylonCanvas;