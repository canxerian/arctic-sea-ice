import { forwardRef, useImperativeHandle, useRef } from "react";
import "./LoadingUI.scss";

const LoadingUI = forwardRef(({ show }, ref) => {
    const fillRef = useRef();

    // Export a function that can be called by the parent directly, because useState is queued
    // and too slow for setting the loading progress
    useImperativeHandle(ref, () => ({
        log(percent) {
            fillRef.current.style.width = `${percent * 100}%`;
        }
    }));

    return <>
        {show &&
            <div id="loading-ui">
                <h2>Loading experience</h2>
                <h3>Warming up...</h3>
                <div className="loading-bar-track">
                    <div className="loading-bar-fill" ref={fillRef} />
                </div>
            </div>
        }
    </>
});
export default LoadingUI;