import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [history, setHistory] = useState([initialMode])

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1)])
    }
    setHistory(prev => [...prev, newMode]);
  }

  const back = () => {
    history.length >= 2 ? setHistory(prev => [...prev.slice(0, prev.length - 1)]) : setHistory(history);
  }

  return { 
    mode: history[history.length - 1],
    transition,
    back
   };
}

