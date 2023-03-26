import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import "./CamZoomUI.scss";

const CamZoomUI = () => {
    const camZoom = useSelector(state => state.app.cameraZoomNormalised);
    const isMouseDown = useRef(false);
    
    return (
        <div id="cam-zoom-ui">
            <div className="slider-track">
                <div
                    className="slider-thumb"
                    style={{ left: `calc(${camZoom * 100}% - 15px)` }}
                    onMouseDown={() => isMouseDown.current = true}
                    onMouseUp={() => isMouseDown.current = false}
                    onMouseMove={(e) => {
                        if (isMouseDown.current) {
                            const parentRect = e.target.parentNode.getBoundingClientRect();

                            const rect = e.target.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / parentRect.width;
                            const y = (e.clientY - rect.top) / parentRect.height;

                            // console.log(thumb.current);
                            // console.log("dragging", rect, x, y);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default CamZoomUI;