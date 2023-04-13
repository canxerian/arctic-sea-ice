import { useEffect, useState } from "react";

export const mobileWidth = 768;

export const MediaScreen = {
    Mobile: 0,
    Desktop: 1,
};

/**
 * Hook that re-renders a component when window size changes
 * @returns MediaScreen
 */
export const useMediaScreen = () => {
    const isMobile = () => window.matchMedia(`(max-width: ${mobileWidth}px)`).matches;

    const [mediaScreen, setMediaScreen] = useState(isMobile() ? MediaScreen.Mobile : MediaScreen.Desktop);

    useEffect(() => {
        const handleResize = () => {
            if (isMobile()) {
                setMediaScreen(MediaScreen.Mobile);
            }
            else {
                setMediaScreen(MediaScreen.Desktop);
            }
        }
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return mediaScreen;
}