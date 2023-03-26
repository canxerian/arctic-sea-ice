import MainUI from './components/MainUI';
import BabylonCanvas from './components/BabylonCanvas';
import HelpUI from './components/HelpUI';
import GitHubButton from './components/GitHubButton';
import CamZoomUI from './components/CamZoomUI';
import './App.scss';

function App() {
  return (
    <>
      <BabylonCanvas />
      <MainUI />
      <HelpUI />
      <CamZoomUI />
      <GitHubButton />
    </>
  );
}

export default App;
