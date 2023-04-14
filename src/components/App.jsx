import { useRef, useState } from 'react';
import BabylonCanvas from './BabylonCanvas';
import MainContent from './MainContent';
import MainUI from './MainUI';
import './App.scss';

function App() {
  const mainContent = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoadProgress = (progress) => {
    mainContent.current.setLoadProgress(progress);

    if (progress.loaded === progress.total) {
      setIsLoaded(true);
    }
  }

  return (
    <>
      <div className='flex-container'>
        <main>
          <MainContent ref={mainContent} isLoaded={isLoaded} />
        </main>
        <aside>
          <MainUI isLoaded={isLoaded} />
        </aside>
      </div>
      <BabylonCanvas onLoadProgress={onLoadProgress} />
    </>
  );
}

export default App;
