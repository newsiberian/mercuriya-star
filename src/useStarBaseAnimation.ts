import { useRef } from 'react';
import { useAnimationFrame } from 'framer-motion';

import { ROUND_TIME } from './StarPath';

export function useStarBaseAnimation(pause: boolean) {
  const starSvgRef = useRef<SVGSVGElement>(null);

  useAnimationFrame(time => {
    // let rotate: number;
    const t = (time - 1) % ROUND_TIME;
    const steady = t >= ROUND_TIME / 2;

    // base rotation
    const rotate = steady
      ? 8 * Math.sin((2 * Math.PI * t) / ROUND_TIME)
      : 12 * Math.sin((2 * Math.PI * t) / ROUND_TIME);

    const y = (1 + Math.sin(time / 1000)) * -5;
    const x = Math.sin((time / 2000) * Math.PI);

    const transform = [];
    transform.push(`translateX(${x}px)`);
    transform.push(`translateY(${y}px)`);
    transform.push(`rotate(${rotate}deg`);

    if (starSvgRef.current) {
      if (pause) {
        starSvgRef.current.style.transform = 'none';
      } else {
        starSvgRef.current.style.transform = transform.join(' ');
      }
    }
  });

  return {
    starSvgRef,
  };
}
