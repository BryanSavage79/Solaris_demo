import { useState } from 'react';
import './App.css';
import { SolarisDashboard } from './components/SolarisDashboard';
import TraceLayerExplorer from './components/TraceLayerExplorer';
import DPPTierSwitcher from './components/DPPTierSwitcher';

type View = 'solaris' | 'tracelayer' | 'dpp';

function App() {
  const [view, setView] = useState<View>('solaris');

  const nav = (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {view !== 'solaris' && (
        <button className="view-toggle-btn" onClick={() => setView('solaris')}>
          ⬡ Solaris Dashboard
        </button>
      )}
      {view !== 'tracelayer' && (
        <button className="view-toggle-btn" onClick={() => setView('tracelayer')}>
          ⬡ TraceLayer Explorer
        </button>
      )}
      {view !== 'dpp' && (
        <button className="view-toggle-btn" onClick={() => setView('dpp')}>
          ◎ DPP Tier Switcher
        </button>
      )}
    </div>
  );

  if (view === 'solaris') {
    return (<><SolarisDashboard />{nav}</>);
  }

  if (view === 'tracelayer') {
    return (<><TraceLayerExplorer />{nav}</>);
  }

  return (<><DPPTierSwitcher />{nav}</>);
}

export default App;
