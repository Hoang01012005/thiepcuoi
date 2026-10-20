import { useState, useEffect } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export function useCountdown(targetDateISO: string): CountdownState {
  const [timeLeft, setTimeLeft] = useState<CountdownState>(() => calculateTime(targetDateISO));

  function calculateTime(dateStr: string): CountdownState {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPassed: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime(targetDateISO));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO]);

  return timeLeft;
}
