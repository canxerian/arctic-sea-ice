import MainUI from './components/MainUI';
import BabylonCanvas from './components/BabylonCanvas';
import './App.scss';
import HelpUI from './components/HelpUI';
import GitHubButton from './components/GitHubButton';

function App() {
  return (
    <>
      <BabylonCanvas />
      <MainUI />
      <HelpUI />
      <GitHubButton />
    </>
  );
}

export default App;
