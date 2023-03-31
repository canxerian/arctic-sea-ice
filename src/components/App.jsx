import MainUI from './MainUI';
import BabylonCanvas from './BabylonCanvas';
import HelpUI from './HelpUI';
import CamZoomUI from './CamZoomUI';
import TitleUI from './TitleUI';
import './App.scss';
import { useState } from 'react';

function App() {
  const [babylonLoaded, setBabylonLoaded] = useState(false);
  return (
    <>
      <BabylonCanvas onReady={() => setBabylonLoaded(true)} />
      <TitleUI babylonLoaded={babylonLoaded} />
      <MainUI />
      <HelpUI />
      <CamZoomUI />
    </>
  );
}

export default App;
