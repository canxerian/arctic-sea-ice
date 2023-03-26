import { useState } from "react"
import "./HelpUI.scss";

const HelpUI = () => {
    const [isOpen, setIsOpen] = useState(false);

    const renderButton = () => {
        return (
            <button id="help-ui-button" title="Open info" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "x" : "?"}
            </button>
        );
    }

    const renderContent = () => {
        return (
            <dialog open={isOpen} id="help-ui-dialog">
                <main className="custom-scrollbar">
                    <h1>Arctic Sea Ice</h1>
                    <section>
                        <h2>How do I use this web app?</h2>
                        <dl>
                            <dt>Filter data:</dt>
                            <dd>Click on the buttons to filter. The list of data will update accordingly</dd>

                            <dt>View historical ice data</dt>
                            <dd>Swipe or scroll the list. The 3D visual will update accordingly.</dd>

                            <dt>View satellite imagery</dt>
                            <dd>Put the scene in "2D" mode</dd>
                        </dl>
                    </section>

                    <section>
                        <h2>Why was this project created?</h2>
                        <p><a href="https://nsidc.org/home">The National Snow and Ice Data Center</a> measure data about our world using very nice satellites and generously make them publicly available. However, specialist software is sometimes required to process and visualise it</p>
                        <p>By making the data interactive, intuitive and visual, the data more accessible and engaging</p>
                        <h2></h2>
                    </section>

                    <section>
                        <h2>What technologies were used to create this?</h2>
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
                    </section>

                    <section>
                        <h2>Who are you?</h2>
                        <p>Mark Nguyen, a Cancerian who like to make things with art, code and design</p>
                    </section>

                    <section>
                        <h2>Can we discuss working with you?</h2>
                        <p>Sure, hello@coding-canxerian.com</p>
                    </section>
                </main>
                <button onClick={() => setIsOpen(false)}>Close</button>
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