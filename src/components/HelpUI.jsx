import { useRef, useState } from "react"
import githubLogo from "../images/github-mark-white.svg";
import "./HelpUI.scss";

const HelpUI = () => {
    /** @type React.MutableRefObject<HTMLDialogElement> */
    const dialogRef = useRef();

    const [isOpen, setIsOpen] = useState(false);

    const setDialogOpen = (v) => {
        if (v) {
            dialogRef.current.showModal();
        }
        else {
            dialogRef.current.close();
        }
        setIsOpen(v);
    }

    const renderButton = () => {
        const title = isOpen ? "Close info" : "Open info";

        return (
            <section className="help">
                <a className="help-ui-button" id="github-button" href="https://github.com/canxerian/arctic-sea-ice">
                    <img alt="GitHub logo" src={githubLogo} />
                </a>

                <button className="help-ui-button" id="info-button" title={title} onClick={() => setDialogOpen(!isOpen)}>
                    i
                </button>
            </section>
        );
    }

    const renderContent = () => {
        const summaryIcon = <span>❄️</span>;
        return (
            <dialog ref={dialogRef} id="help-ui-dialog">
                <div className="dialog-content-container">
                    <div className="dialog-content custom-scrollbar">
                        <h2>Arctic Sea Ice Data Explorer</h2>

                        <details>
                            <summary>
                                <h4>{summaryIcon}What can I do with this app?</h4>
                            </summary>
                            <dl>
                                <dt>Filter data:</dt>
                                <dd>Click on the buttons to filter. The list of data updates accordingly</dd>

                                <dt>View historical ice data:</dt>
                                <dd>Swipe or scroll the list. The 3D visual updates accordingly.</dd>

                                <dt>View satellite imagery:</dt>
                                <dd>Put the scene in "2D" mode (maximum zoom)</dd>
                            </dl>
                        </details>

                        <details>
                            <summary>
                                <h4>{summaryIcon}Why was this project created?</h4>
                            </summary>
                            <p><a href="https://nsidc.org/home">The National Snow and Ice Data Center</a> measure data about our world using very nice satellites and generously make them publicly available. However, specialist software is sometimes required to process and visualise it</p>
                            <p>By making the data interactive, intuitive and visual, the data becomes more accessible and engaging. The web app can run on desktop, tablet and mobile.</p>
                            <p>Finally, I wanted to gain more experience with 3D web, shaders, 3D modelling and UI/UX.</p>
                        </details>

                        <details>
                            <summary>
                                <h4>{summaryIcon}What technologies were used to create this?</h4>
                            </summary>
                            <dl>
                                <dt>3D rendering:</dt>
                                <dd><a href="https://www.babylonjs.com/">babylon.js</a> and custom shaders</dd>

                                <dt>Initial project creation:</dt>
                                <dd><a href="https://create-react-app.dev/">create-react-app</a></dd>

                                <dt>UI and styling:</dt>
                                <dd><a href="https://react.dev/">React</a>, <a href="https://sass-lang.com/">Sass</a></dd>

                                <dt>Interface design:</dt>
                                <dd><a href="https://figma.com/">Figma</a></dd>

                                <dt>3D modelling:</dt>
                                <dd><a href="https://blender.org/">Blender</a></dd>
                            </dl>
                        </details>

                        <details>
                            <summary>
                                <h4>{summaryIcon}Who created this?</h4>
                            </summary>
                            <p>Mark Nguyen, a software engineer who like to make things with art, code, data and design</p>
                            <ul>
                                <li>Twitter @CodingCanxerian</li>
                            </ul>
                        </details>
                    </div>
                    <button title="Close dialog modal" onClick={() => setDialogOpen(false)}>Close</button>
                </div>
            </dialog>
        );
    }

    return (
        <>
            {renderButton()}
            {renderContent()}
        </>
    )
}

export default HelpUI;