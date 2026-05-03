import { useState } from 'react';
import './App.css';
import { evaluate } from './core/evaluator';
import { actorRegistry } from './registry/actors';
import { euDppV1 } from './registry/profiles/eu-dpp-v1';
import { draft2027 } from './registry/profiles/draft-2027';
import { demoSteps } from './data/demoEvents';
import type { EvaluationResult, RuleProfile } from './core/types';
import { VerdictHeader } from './components/VerdictHeader';
import { RuleList } from './components/RuleList';
import { Timeline } from './components/Timeline';
import { AuditExport } from './components/AuditExport';
import { DemoControls } from './components/DemoControls';
import { BlockchainVerification } from './components/BlockchainVerification';

const profileMap: Record<string, RuleProfile> = {
  EU_DPP_2026: euDppV1,
  DRAFT_EU_DPP_2027: draft2027,
};

function App() {
  const [stepIndex, setStepIndex] = useState(0);

  const step = demoSteps[stepIndex];
  const profile = profileMap[step.profile];
  const result: EvaluationResult = evaluate(step.events, profile, actorRegistry);
  const allTraces = result.ruleResults.flatMap(r => r.trace);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">⬡</span>
            <h1 className="header-title">Solaris Compliance Engine</h1>
            <span className="header-subtitle">Regulatory Logic as Code</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DemoControls steps={demoSteps} currentStep={stepIndex} onStepChange={setStepIndex} />
        {result && (
          <>
            <VerdictHeader result={result} />
            <BlockchainVerification />
            <div className="content-grid">
              <RuleList ruleResults={result.ruleResults} />
              <Timeline events={step.events} traces={allTraces} />
            </div>
            <AuditExport events={step.events} profile={profile} verdict={result} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
