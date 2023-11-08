import { useRef, useState } from 'react';
import { useAnimationFrame } from 'framer-motion';

import { ROUND_TIME } from './StarPath';

const PAUSE_DURATION = 400;
const hoveredFinalXPosition = -100; // Конечная позиция объекта по X

const computeY = (time: number) => (1 + Math.sin(time / 1000)) * -5;

const computeX = (time: number) => Math.sin((time / 2000) * Math.PI);

export function useStarBaseAnimation(pause: boolean) {
  const starSvgRef = useRef<SVGSVGElement>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);

  useAnimationFrame(time => {
    let pauseStartTime = pauseTime;
    const t = (time - 1) % ROUND_TIME;
    const steady = t >= ROUND_TIME / 2;

    if (pause && typeof pauseTime !== 'number') {
      pauseStartTime = time;
      setPauseTime(time);
    }

    if (!pause && typeof pauseTime === 'number') {
      setPauseTime(null);
    }

    const elapsedPauseTime = pauseStartTime ? time - pauseStartTime : 0;

    // base rotation
    const rotate = steady
      ? 8 * Math.sin((2 * Math.PI * t) / ROUND_TIME)
      : 12 * Math.sin((2 * Math.PI * t) / ROUND_TIME);

    let y: number, x: number;

    if (elapsedPauseTime > 0) {
      if (elapsedPauseTime >= PAUSE_DURATION) {
        y = 0;
        x = hoveredFinalXPosition;
      } else {
        const t = elapsedPauseTime / PAUSE_DURATION;
        y = (1 - t) * computeY(time);
        const xPosition = computeX(time);
        x = xPosition + (hoveredFinalXPosition - xPosition) * t;
      }
    } else {
      y = computeY(time);
      x = computeX(time);
    }

    const transform = [];
    transform.push(`translateX(${x}px)`);
    transform.push(`translateY(${y}px)`);
    transform.push(`rotate(${pause ? 0 : rotate}deg`);

    if (starSvgRef.current) {
      starSvgRef.current.style.transform = transform.join(' ');
    }
  });

  return { starSvgRef };
}
