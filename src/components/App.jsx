import MainUI from './MainUI';
import BabylonCanvas from './BabylonCanvas';
import HelpUI from './HelpUI';
import CamZoomUI from './CamZoomUI';
import TitleUI from './TitleUI';
import './App.scss';
import { useState } from 'react';

function App() {
  const [babylonLoaded, setBabylonLoaded] = useState(false);

  const onLoadProgress = (progress) => {
    if (progress.total === progress.loaded) {
      setBabylonLoaded(true)
    }
  }

  return (
    <>
      <BabylonCanvas onLoadProgress={onLoadProgress} />
      <TitleUI babylonLoaded={babylonLoaded} />
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
