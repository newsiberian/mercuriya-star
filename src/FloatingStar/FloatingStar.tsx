import { motion } from 'framer-motion';

import { StarTail } from '../StarTail/index.mjs';
import { StarPath } from './StarPath.tsx';
import { useStarBaseAnimation } from './useStarBaseAnimation.mjs';

export function FloatingStar({ hover }: { hover: boolean }) {
  // const hover = true;
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
        <svg viewBox="-2 -2 54 54">
          <StarPath pauseAnimation={hover} />
        </svg>

        {hover && (
          <svg
            id="tail"
            width="210"
            height="161"
            viewBox="-34 51 210 161"
            // to be able to render tail outside of parent viewBox
            style={{ overflow: 'visible' }}
          >
            <StarTail />
          </svg>
        )}
      </motion.g>
    </svg>
  );
}
