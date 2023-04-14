import { forwardRef, useImperativeHandle, useRef } from "react";
import CamZoomUI from "./CamZoomUI";
import HelpUI from "./HelpUI";
import "./MainContent.scss";

const MainContent = forwardRef(({ isLoaded }, ref) => {
    const loadingBarFill = useRef();

    // Export a function that can be called by the parent directly, because useState is queued
    // and too slow for setting the loading progress
    useImperativeHandle(ref, () => ({
        setLoadProgress(progress) {
            const percent = progress.loaded / progress.total * 100;
            loadingBarFill.current.style.width = `${percent}%`;
        }
    }));

    const loadedClassName = isLoaded ? "loaded" : undefined;
    return (
        <>
            <section className={`loading ${loadedClassName}`}>
                <div className="loading-content">
                    <h3>Loading..</h3>
                    <div className="loading-bar-track">
                        <div className="loading-bar-fill" ref={loadingBarFill} />
                    </div>
                </div>
            </section>
            <section className={`title ${loadedClassName}`}>
                <h3>Arctic Sea Ice Data Explorer</h3>
                <h1>An interactive, 3D explorer of the Arctic Sea Index</h1>
                <p>Data sourced from <a href="https://nsidc.org/data/seaice_index/data-and-image-archive">NSIDC data and image archive</a></p>
            </section>
            {isLoaded && <HelpUI />}
            {isLoaded && <CamZoomUI />}
        </>
    )
});

export default MainContent;