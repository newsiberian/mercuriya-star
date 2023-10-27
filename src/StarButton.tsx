import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  MotionValue,
  animate,
} from 'framer-motion';
import { interpolate } from 'flubber';

const ROUND_TIME = 4000;

// hours position on a clock face
// order: 7h, 12h, 5h, 10h, 2h, 8h, 4h
const paths = [
  // initial
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                              vvv 7
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 50L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                        vvv 12
  'M28.3138 13.0601L23.4643 -2L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                  vvv 5
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L36 49L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                        vvvvvvvv 10
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L4 6.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                                                                                 vvv 2
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L42 5L28.3138 13.0601Z',
  //                                                                       vvvvv 8
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L-2 35L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                                                 vvvv 4
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L49 30L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  // reset
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
];

export function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(
    progress,
    paths.map((_, i) => i),
    paths,
    {
      mixer: (a, b) => interpolate(a, b),
    },
  );
}

export function StarButton() {
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  const ref = useRef<SVGSVGElement>(null);
  const path = useFlubber(progress, paths);

  useAnimationFrame(time => {
    // let rotate: number;
    const t = (time - 1) % ROUND_TIME;
    const steady = t >= ROUND_TIME / 2;

    // base rotation
    const rotate = steady
      ? 8 * Math.sin((2 * Math.PI * t) / ROUND_TIME)
      : 12 * Math.sin((2 * Math.PI * t) / ROUND_TIME);

    const y = (1 + Math.sin(time / 1000)) * -5;

    const transform = [];
    transform.push(`translateY(${y}px)`);
    transform.push(`rotate(${rotate}deg`);

    if (ref.current) {
      ref.current.style.transform = transform.join(' ');
    }
  });

  useEffect(() => {
    const animation = animate(progress, pathIndex, {
      duration: ROUND_TIME / 7 / 1000,
      ease: 'easeInOut',
      onComplete: () => {
        if (pathIndex === paths.length - 1) {
          progress.set(0);
          setPathIndex(1);
        } else {
          setPathIndex(pathIndex + 1);
        }
      },
    });

    return () => animation.stop();
  }, [pathIndex, progress]);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 52 52"
      width="48"
      height="48"
      fill="none"
    >
      <motion.path
        fill="#F7B21A"
        fillRule="evenodd"
        clipRule="evenodd"
        d={path}
      />
    </svg>
  );
}
