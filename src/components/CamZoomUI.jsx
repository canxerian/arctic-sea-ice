import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCameraZoomNormalised, setIsOverridingZoom } from "../redux/appSlice";

import "./CamZoomUI.scss";

const CamZoomUI = () => {
    const camZoom = useSelector(state => state.app.cameraZoomNormalised);
    const dispatch = useDispatch();

    const onSliderChange = (value) => {
        dispatch(setIsOverridingZoom(true));
        dispatch(setCameraZoomNormalised(value / 100));
    }

    return (
        <div id="cam-zoom-ui">
            <input
                type="range"
                className="slider"
                min="1"
                max="100"
                value={camZoom * 100}
                onChange={(e) => onSliderChange(e.target.value)}
            />
        </div>
    );
}

export default CamZoomUI;