import type { JSX } from 'react';
import { motion } from 'framer-motion';

import { StarTail } from '../StarTail/index.mjs';
import { PAUSE_DURATION } from '../StarTail/constants.mjs';
import { StarPath } from './StarPath.tsx';
import { useStarBaseAnimation } from './useStarBaseAnimation.mjs';

type FloatingStarProps = {
  text: JSX.Element;
  hover: boolean;
};

export function FloatingStar({ hover, text }: FloatingStarProps) {
  const { starSvgRef } = useStarBaseAnimation(hover);

  return (
    <svg
      ref={starSvgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      width="52"
      height="52"
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <motion.g
        animate={{ x: hover ? -90 : 0 }}
        transition={{
          type: 'spring',
          damping: 5,
          stiffness: 20,
          restDelta: 0.001,
        }}
      >
        <svg width="54" height="54" viewBox="-2 -2 54 54">
          <StarPath pauseAnimation={hover} />
        </svg>

        {hover && (
          <svg
            id="tail"
            width="210"
            height="161"
            viewBox="-35 50 210 161"
            // to be able to render tail outside of parent viewBox
            style={{ overflow: 'visible' }}
          >
            <StarTail />
            <motion.foreignObject
              x="0"
              y="25%"
              width="100%"
              height="35%"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: PAUSE_DURATION / 2 / 1000, duration: 0.5 }}
            >
              {text}
            </motion.foreignObject>
          </svg>
        )}
      </motion.g>
    </svg>
  );
}
