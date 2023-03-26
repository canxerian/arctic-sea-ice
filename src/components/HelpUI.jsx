import { useState } from "react"
import "./HelpUI.scss";

const HelpUI = () => {
    const [isOpen, setIsOpen] = useState();

    return (
        <button id="help-ui-button">?</button>
    )
}

export default HelpUI;