// Six-digit OTP input with keyboard-friendly next-field focus behavior.
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const OTP_LENGTH = 6;

export const OTPInput = ({ value, onChange, error }: OTPInputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? '');

  const updateDigit = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const nextDigit = event.target.value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextDigit;
    onChange(nextDigits.join(''));

    if (nextDigit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <div className="otp-input" aria-label="One-time password">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => { inputRefs.current[index] = element; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            aria-label={`OTP digit ${index + 1}`}
            aria-invalid={Boolean(error)}
            onChange={(event) => updateDigit(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
      {error && <small className="auth-error">{error}</small>}
    </div>
  );
};
