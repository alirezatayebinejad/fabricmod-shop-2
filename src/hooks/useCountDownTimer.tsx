import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Utility function to format time as hh:mm:ss or mm:ss
 * @param {number} totalSeconds - The total seconds to format.
 * @returns {string} - The formatted time string.
 */
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
  const formattedMinutes = `${String(minutes).padStart(2, "0")}`;
  const formattedSeconds = `${String(seconds).padStart(2, "0")}`;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Custom hook for a countdown timer.
 * @param {number} initialSeconds - The initial countdown time in seconds.
 * @param {Function} onComplete - The function to call when the countdown is complete.
 * @param {boolean} autoStart - Whether the timer should start automatically on mount.
 * @returns {Object} - An object containing the formatted time string, a function to start the timer, a function to reset the timer, and the status of the timer.
 */
const useCountdownTimer = (
  initialSeconds: number,
  onComplete?: () => void,
  autoStart: boolean = true,
) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [timerStatus, setStatus] = useState<
    "running" | "stopped" | "completed"
  >(autoStart ? "running" : "stopped");
  // Refs to store the interval ID and end time
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<Date | null>(null);

  const startTimer = useCallback(() => {
    setStatus("running");
    // Calculate the end time based on the current time and remaining seconds
    endTimeRef.current = new Date(new Date().getTime() + secondsLeft * 1000);

    // Set up an interval to update the remaining time every second
    intervalRef.current = setInterval(() => {
      const now = new Date();
      if (endTimeRef.current) {
        // Calculate the remaining time
        const remainingTime = Math.round(
          (endTimeRef.current.getTime() - now.getTime()) / 1000,
        );
        if (remainingTime <= 0) {
          // If the remaining time is zero or less, clear the interval and call onComplete
          clearInterval(intervalRef.current!);
          setSecondsLeft(0);
          setStatus("completed");
          if (onComplete) onComplete();
        } else {
          // Otherwise, update the remaining seconds
          setSecondsLeft(remainingTime);
        }
      }
    }, 1000);
  }, [secondsLeft, onComplete]);

  // Effect to start the timer automatically if autoStart is true
  useEffect(() => {
    if (autoStart && timerStatus === "running") {
      startTimer();
    }

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart, startTimer, timerStatus]);

  // Function to reset the timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Reset the remaining seconds and timerStatus
    setSecondsLeft(initialSeconds);
    setStatus(autoStart ? "running" : "stopped");
    if (autoStart) {
      startTimer();
    }
  }, [initialSeconds, autoStart, startTimer]);

  // Format the remaining seconds into a time string
  const formattedTime = formatTime(secondsLeft);

  // Return the formatted time, startTimer function, resetTimer function, and timerStatus
  return {
    formattedTime,
    startTimer,
    resetTimer,
    timerStatus,
  };
};

export default useCountdownTimer;
