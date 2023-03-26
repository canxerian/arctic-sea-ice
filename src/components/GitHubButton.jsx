import githubLogo from "../images/github-mark-white.svg";
import "./GitHubButton.scss";

const GitHubButton = () => {
    return (
        <a href="https://github.com/canxerian/Arctic-Sea-Ice.JS" id="github-button">
            <img src={githubLogo} />
        </a>

    );
}

export default GitHubButton;