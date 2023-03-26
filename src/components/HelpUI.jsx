import { useState } from "react"
import "./HelpUI.scss";

const HelpUI = () => {
    const [isOpen, setIsOpen] = useState(false);

    const renderButton = () => {
        const title = isOpen ? "Close info" : "Open info";
        return (
            <button id="help-ui-button" title={title} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "x" : "?"}
            </button>
        );
    }

    const renderContent = () => {
        const summaryIcon = <span>❄️</span>;
        return (
            <dialog open={isOpen} id="help-ui-dialog">
                <main className="custom-scrollbar">
                    <h1>Arctic Sea Ice</h1>

                    <details>
                        <summary>
                            <h2>{summaryIcon}What can I do with this app?</h2>
                        </summary>
                        <dl>
                            <dt>Filter data:</dt>
                            <dd>Click on the buttons to filter. The list of data updates accordingly</dd>

                            <dt>View historical ice data:</dt>
                            <dd>Swipe or scroll the list. The 3D visual updates accordingly.</dd>

                            <dt>View satellite imagery:</dt>
                            <dd>Put the scene in "2D" mode</dd>
                        </dl>
                    </details>

                    <details>
                        <summary>
                            <h2>{summaryIcon}Why was this project created?</h2>
                        </summary>
                        <p><a href="https://nsidc.org/home">The National Snow and Ice Data Center</a> measure data about our world using very nice satellites and generously make them publicly available. However, specialist software is sometimes required to process and visualise it</p>
                        <p>By making the data interactive, intuitive and visual, the data becomes more accessible and engaging. The web app can run on desktop, tablet and mobile.</p>
                    </details>

                    <details>
                        <summary>
                            <h2>{summaryIcon}What technologies were used to create this?</h2>
                        </summary>
                        <dl>
                            <dt>3D rendering:</dt>
                            <dd><a href="https://www.babylonjs.com/">babylon.js</a> and custom shaders</dd>

                            <dt>Project bootstrap:</dt>
                            <dd><a href="https://create-react-app.dev/">create-react-app</a></dd>

                            <dt>UI, Styling:</dt>
                            <dd><a href="https://react.dev/">React</a>, <a href="https://sass-lang.com/">Sass</a></dd>

                            <dt>3D modelling:</dt>
                            <dd><a href="https://blender.org/">Blender</a></dd>
                        </dl>
                    </details>

                    <details>
                        <summary>
                            <h2>{summaryIcon}Can we discuss working with you?</h2>
                        </summary>
                        <p>Sure, hello@coding-canxerian.com</p>
                    </details>

                    <details>
                        <summary>
                            <h2>{summaryIcon}Who created this?</h2>
                        </summary>
                        <p>Mark Nguyen, a Cancerian who like to make things with art, code and design</p>
                        <ul>
                            <li>Instagram: @coding.canxerian</li>
                            <li>Twitter @coding.canxerian</li>
                        </ul>
                    </details>
                </main>
                <button title="Close dialog modal" onClick={() => setIsOpen(false)}>Close</button>
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