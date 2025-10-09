import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for typewriter animation with pause capability
 * @param {Object} options - Configuration options
 * @param {string} options.fullText - The complete text to type out
 * @param {number} options.speedMs - Milliseconds per character (default: 50)
 * @param {number} options.pauseAfterIndex - Index after which to pause (default: -1, no pause)
 * @param {number} options.pauseMs - Milliseconds to pause (default: 1500)
 * @param {boolean} options.play - Whether to play the animation (default: true)
 * @param {boolean} options.reducedMotion - Skip animation if true (default: false)
 * @returns {Object} - { text: current typed text, done: boolean indicating completion }
 */
export function useTypewriter({
  fullText,
  speedMs = 50,
  pauseAfterIndex = -1,
  pauseMs = 1500,
  play = true,
  reducedMotion = false,
}) {
  const [text, setText] = useState(reducedMotion ? fullText : '');
  const [done, setDone] = useState(reducedMotion || !play);
  const idxRef = useRef(0);
  const pausedRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !play || done) return;
    
    mountedRef.current = true;
    idxRef.current = 0;
    pausedRef.current = false;
    setText('');
    setDone(false);

    const tick = () => {
      if (!mountedRef.current) return;
      
      // Check if we should pause at this position
      if (!pausedRef.current && pauseAfterIndex >= 0 && idxRef.current === pauseAfterIndex + 1) {
        pausedRef.current = true;
        setTimeout(() => {
          pausedRef.current = false;
          tick();
        }, pauseMs);
        return;
      }
      
      // Continue typing
      if (idxRef.current < fullText.length) {
        setText(fullText.slice(0, idxRef.current + 1));
        idxRef.current += 1;
        setTimeout(tick, speedMs);
      } else {
        setDone(true);
      }
    };

    tick();

    return () => {
      mountedRef.current = false;
    };
  }, [fullText, speedMs, pauseAfterIndex, pauseMs, play, reducedMotion]);

  return { text, done };
}

