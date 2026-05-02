import React from 'react';
import type { DemoStep } from '../data/demoEvents';

interface Props {
  steps: DemoStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const DemoControls: React.FC<Props> = ({ steps, currentStep, onStepChange }) => {
  const step = steps[currentStep];
  return (
    <div className="demo-controls">
      <div className="step-buttons">
        {steps.map((_s, i) => (
          <button
            key={i}
            className={`step-btn ${i === currentStep ? 'step-btn-active' : ''}`}
            onClick={() => onStepChange(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="step-info">
        <div className="step-title">{step.title}</div>
        <div className="step-desc">{step.description}</div>
      </div>
    </div>
  );
};
