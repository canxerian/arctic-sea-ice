import MainUI from './components/MainUI';
import BabylonCanvas from './components/BabylonCanvas';
import './App.scss';
import HelpUI from './components/HelpUI';

function App() {
  return (
    <>
      <BabylonCanvas />
      <MainUI />
      <HelpUI />
    </>
  );
}

export default App;
