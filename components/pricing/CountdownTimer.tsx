"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get or set the initial timestamp
    const getInitialTimestamp = () => {
      const stored = localStorage.getItem('pricingTimerStart');
      if (stored) {
        const timestamp = parseInt(stored, 10);
        const elapsed = Date.now() - timestamp;
        
        // If more than 48 hours have passed, reset
        if (elapsed >= 48 * 60 * 60 * 1000) {
          const newTimestamp = Date.now();
          localStorage.setItem('pricingTimerStart', newTimestamp.toString());
          return newTimestamp;
        }
        return timestamp;
      } else {
        const newTimestamp = Date.now();
        localStorage.setItem('pricingTimerStart', newTimestamp.toString());
        return newTimestamp;
      }
    };

    const initialTimestamp = getInitialTimestamp();

    const calculateTimeLeft = () => {
      const endTime = initialTimestamp + (48 * 60 * 60 * 1000); // 48 hours
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        // Timer expired, reset to 48 hours and loop
        const newTimestamp = Date.now();
        localStorage.setItem('pricingTimerStart', newTimestamp.toString());
        return { hours: 48, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <TimeBox value={48} label="Heures" />
        <span className="text-white text-2xl font-light">:</span>
        <TimeBox value={0} label="Minutes" />
        <span className="text-white text-2xl font-light">:</span>
        <TimeBox value={0} label="Secondes" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <TimeBox value={timeLeft.hours} label="Heures" />
      <span className="text-white text-2xl font-light">:</span>
      <TimeBox value={timeLeft.minutes} label="Minutes" />
      <span className="text-white text-2xl font-light">:</span>
      <TimeBox value={timeLeft.seconds} label="Secondes" />
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gradient-to-b from-[#2E3139] to-[#1E2536] border-2 border-[#5B698B] rounded-lg px-4 py-3 min-w-[80px] bp3:min-w-[60px]">
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl bp3:text-2xl font-bold text-white"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-xs text-gray-400 mt-1 font-light">{label}</span>
    </motion.div>
  );
}

