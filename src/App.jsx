import MainUI from './components/MainUI';
import BabylonCanvas from './components/BabylonCanvas';
import './App.scss';

function App() {
  return (
    <>
      {/* <h1>Arctic Sea Ice</h1>
      <p>A cosy data visualisation</p> */}
      <BabylonCanvas />
      <MainUI />
    </>
  );
}

export default App;
