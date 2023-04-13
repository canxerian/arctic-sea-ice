import HelpUI from "./HelpUI";
import githubLogo from "../images/github-mark-white.svg";
import "./MainContent.scss";

const MainContent = () => {
    const title = true ? "Close info" : "Open info";

    return (
        <>
            <section className="title">
                <h3 className="no-pointer">Arctice Sea Ice Data Explorer</h3>
                <h1>An interactive, 3D explorer of the Arctic Sea Index</h1>
                <p>Data sourced from <a href="https://nsidc.org/data/seaice_index/data-and-image-archive">NSIDC data and image archive</a></p>
            </section>
            <HelpUI />
        </>
    )
}

export default MainContent;