import { useEffect, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { interpolate } from 'flubber';

import { ROUND_TIME } from './useStarBaseAnimation.mjs';

function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(
    progress,
    paths.map((_, i) => i),
    paths,
    {
      mixer: (a, b) => interpolate(a, b),
    },
  );
}

// original path:
// 'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
// hours position on a clock face
// order: 7h, 12h, 5h, 10h, 2h, 8h, 4h
const paths = [
  // initial
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                              vvv 7h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 50L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                        vvv 12h
  'M28.3138 13.0601L23.4643 -2L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                  vvv 5h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L36 49L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                        vvvvvvvv 10h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L4 6.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                                                                                 vvv 2h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L42 5L28.3138 13.0601Z',
  //                                                                       vvvvv 8h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L-2 35L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  //                                                                                                                                                                 vvvv 4h
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L49 30L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
  // reset
  'M28.3138 13.0601L23.4643 0L18.8919 14.92L5.73141 9.13967L11.589 22.7417L1.13989 32.0676L14.6158 33.3713L14.556 48L23.7247 36.9694L34.2001 46.8444L33.4428 32.1823L46.8542 28.7919L34.2622 21.1707L40.6048 6.89534L28.3138 13.0601Z',
];

export const StarPath = ({ pauseAnimation }: { pauseAnimation: boolean }) => {
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  // since we can't normally stop animation (all methods I've found not stopping animation immediately),
  // we do this hack w/ paths substitution
  const path = useFlubber(progress, pauseAnimation ? [paths[0]] : paths);

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
  }, [pathIndex, progress, pauseAnimation]);

  return (
    <>
      <motion.path
        fill="#F7B21A"
        fillRule="evenodd"
        clipRule="evenodd"
        d={path}
      />
    </>
  );
};
