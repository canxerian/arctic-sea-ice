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

    // loadingRef.current.log(percent)

    setLoadingProgress(percent);
  }

  const babylonLoaded = loadingProgress >= 1;

  return (
    <>

      <div className='flex-container'>
        <main>
          <TitleUI babylonLoaded={babylonLoaded} />
          <LoadingUI ref={loadingRef} show={babylonLoaded} />
          <HelpUI />
          <CamZoomUI />
        </main>
        <aside>
          <MainUI />
        </aside>
      </div>

      {/* {babylonLoaded &&
        <>
          <MainUI />
          <HelpUI />
          <CamZoomUI />
        </>
      } */}
      <BabylonCanvas onLoadProgress={onLoadProgress} />
    </>
  );
}

export default App;
