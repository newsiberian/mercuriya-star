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
// this is vvv the original order, but I think new order looks more strict
// order: 7h, 12h, 5h, 10h, 2h, 8h, 4h

const topValues = {
  h7: '50',
  h12: '-2',
  h5: '36 49',
  h10: '4 6.13967',
  h2: '42 5',
  h8: '-2 35',
  h4: '49 30',
};
const topsArr = ['h7', 'h12', 'h5', 'h10', 'h4', 'h8', 'h2'] as const;

type ConstructPathParam = Partial<Record<(typeof topsArr)[number], string>>;

const constructPath = (tops: ConstructPathParam) =>
  `M28.3138 13.0601L23.4643 ${tops.h12 || '0'}L18.8919 14.92L${
    tops.h10 || '5.73141 9.13967'
  }L11.589 22.7417L${tops.h8 || '1.13989 32.0676'}L14.6158 33.3713L14.556 ${
    tops.h7 || '48'
  }L23.7247 36.9694L${tops.h5 || '34.2001 46.8444'}L33.4428 32.1823L${
    tops.h4 || '46.8542 28.7919'
  }L34.2622 21.1707L${tops.h2 || '40.6048 6.89534'}L28.3138 13.0601Z`;

const paths = topsArr.map(topName => {
  const tops: ConstructPathParam = {
    [topName]: topValues[topName],
  };
  return constructPath(tops);
});

paths.push(constructPath({}));
paths.unshift(constructPath({}));

export const StarPath = ({ pauseAnimation }: { pauseAnimation: boolean }) => {
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  // since we can't normally stop animation (all methods I've found not stopping animation immediately),
  // we do this hack w/ paths substitution
  const path = useFlubber(progress, pauseAnimation ? [paths[0]] : paths);

  useEffect(() => {
    const animation = animate(progress, pathIndex, {
      duration: ROUND_TIME / topsArr.length / 1000,
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
