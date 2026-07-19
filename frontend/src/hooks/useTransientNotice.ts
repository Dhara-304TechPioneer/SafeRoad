import { useCallback, useEffect, useRef, useState } from 'react';

/** Displays a short-lived, accessible status message without leaving stale timers behind. */
export const useTransientNotice = (duration = 3000) => {
  const [notice, setNotice] = useState('');
  const timerRef = useRef<number | undefined>(undefined);

  const showNotice = useCallback((message: string) => {
    window.clearTimeout(timerRef.current);
    setNotice(message);
    timerRef.current = window.setTimeout(() => setNotice(''), duration);
  }, [duration]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { notice, showNotice };
};
