import MainUI from './components/MainUI';
import BabylonCanvas from './components/BabylonCanvas';
import HelpUI from './components/HelpUI';
import CamZoomUI from './components/CamZoomUI';
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
