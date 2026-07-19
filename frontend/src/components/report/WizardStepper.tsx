// Displays the current report wizard step.
interface Props { currentStep: number; }
export const WizardStepper = ({ currentStep }: Props) => <ol className="wizard-stepper">{['Upload image', 'Location', 'Details', 'AI analysis', 'Review'].map((label, index) => <li key={label} className={index + 1 <= currentStep ? 'is-active' : ''}><span>{index + 1}</span>{label}</li>)}</ol>;
