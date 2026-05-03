import { useState } from 'react';
import './App.css';
import { SolarisDashboard } from './components/SolarisDashboard';
import TraceLayerExplorer from './components/TraceLayerExplorer';

type View = 'solaris' | 'tracelayer';

function App() {
  const [view, setView] = useState<View>('solaris');

  if (view === 'solaris') {
    return (
      <>
        <SolarisDashboard />
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
          <button
            className="view-toggle-btn"
            onClick={() => setView('tracelayer')}
          >
            ⬡ TraceLayer Explorer
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <TraceLayerExplorer />
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
        <button
          className="view-toggle-btn"
          onClick={() => setView('solaris')}
        >
          ⬡ Solaris Dashboard
        </button>
      </div>
    </>
  );
}

export default App;
