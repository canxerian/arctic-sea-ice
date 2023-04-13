import CamZoomUI from "./CamZoomUI";
import HelpUI from "./HelpUI";
import "./MainContent.scss";

const MainContent = () => {
    return (
        <>
            <section className="title">
                <h3>Arctice Sea Ice Data Explorer</h3>
                <h1>An interactive, 3D explorer of the Arctic Sea Index</h1>
                <p>Data sourced from <a href="https://nsidc.org/data/seaice_index/data-and-image-archive">NSIDC data and image archive</a></p>
            </section>
            <HelpUI />
            <CamZoomUI />
        </>
    )
}

export default MainContent;