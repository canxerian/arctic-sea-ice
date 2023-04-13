import { useRef, useState } from 'react';
import BabylonCanvas from './BabylonCanvas';
import HelpUI from './HelpUI';
import CamZoomUI from './CamZoomUI';
import LoadingUI from './LoadingUI';
import MainUI from './MainUI';
import MainContent from './MainContent';
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
          <MainContent />
          {/* <LoadingUI ref={loadingRef} show={babylonLoaded} /> */}
        </main>
        <aside>
          <MainUI />
        </aside>
      </div>
      <BabylonCanvas onLoadProgress={onLoadProgress} />
    </>
  );
}

export default App;
