import MainUI from './MainUI';
import BabylonCanvas from './BabylonCanvas';
import HelpUI from './HelpUI';
import CamZoomUI from './CamZoomUI';
import TitleUI from './TitleUI';
import { useRef, useState } from 'react';
import LoadingUI from './LoadingUI';
import './App.scss';

function App() {
  const loadingRef = useRef();
  const [loadingProgress, setLoadingProgress] = useState(0);

  const onLoadProgress = (progress) => {
    const percent = progress.loaded / progress.total;

    loadingRef.current.log(percent)

    setLoadingProgress(percent);
  }

  const babylonLoaded = loadingProgress >= 1;

  return (
    <>
      <BabylonCanvas onLoadProgress={onLoadProgress} />
      <TitleUI babylonLoaded={babylonLoaded} />
      <LoadingUI ref={loadingRef} show={!babylonLoaded} />
      {/* <div style={{ position: "absolute", top: 0, left: 0 }} ref={progressRef}>value</div> */}
      {babylonLoaded &&
        <>
          <MainUI />
          <HelpUI />
          <CamZoomUI />
        </>
      }
    </>
  );
}

export default App;
