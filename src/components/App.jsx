import MainUI from './MainUI';
import BabylonCanvas from './BabylonCanvas';
import HelpUI from './HelpUI';
import CamZoomUI from './CamZoomUI';
import './App.scss';

function App() {
  return (
    <>
      <BabylonCanvas onReady={() => console.log("Babylonjs is ready")} />
      <MainUI />
      <HelpUI />
      <CamZoomUI />
    </>
  );
}

export default App;
