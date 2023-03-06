const startTime = (new Date()).getTime();

export const getElapsedTimeMs = () => {
    const timeMs = (new Date()).getTime() - startTime;
    return timeMs / 1000.0;
}