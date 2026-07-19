// Shared navigation actions for wizard steps.
interface Props { currentStep: number; onBack: () => void; onNext: () => void; nextLabel?: string; }
export const ProgressButtons = ({ currentStep, onBack, onNext, nextLabel = 'Continue' }: Props) => <div className="wizard-actions">{currentStep > 1 && <button type="button" className="button-secondary" onClick={onBack}>Back</button>}<button type="button" className="button-primary" onClick={onNext}>{nextLabel}</button></div>;
