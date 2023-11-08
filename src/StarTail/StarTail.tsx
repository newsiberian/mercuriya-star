import { useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

import {
  LOWER_CURVE_START_X,
  LOWER_START_RAY_X,
  LOWER_START_RAY_Y,
  PAUSE_DURATION,
  TAIL_END_X,
  UPPER_CURVE_START_X,
  UPPER_CURVE_START_Y,
} from './constants.mjs';
import {
  buildLowerCurve,
  buildUpperCurve,
  curveDataToString,
  toFixed,
} from './utils.mjs';

export function StarTail() {
  const starTailRef = useRef<SVGPathElement>(null);
  const lowerCurveAnimationStartDelay = useRef(0);

  useAnimationFrame(time => {
    if (time === 0) {
      lowerCurveAnimationStartDelay.current = 0;
    }

    if (time >= PAUSE_DURATION) {
      return;
    }

    // we can't afford having time = 0 here, because vertical line will be too short
    const t = time / PAUSE_DURATION;

    // we assume that starting point ("x") should be in parallel w/ lower curve "x"
    // because its located righter than upper curve starting "x"
    const tailEndX = toFixed(
      UPPER_CURVE_START_X + (TAIL_END_X - UPPER_CURVE_START_X) * t,
    );

    // compute tail movement here
    const upperCurve = buildUpperCurve(t, tailEndX);

    // add a delay for start animating lower curve until upper curve not cross
    // lower curve beginning vertically
    if (
      upperCurve.x >= LOWER_CURVE_START_X &&
      lowerCurveAnimationStartDelay.current === 0
    ) {
      lowerCurveAnimationStartDelay.current = t;
    }

    const lowerCurve = buildLowerCurve(
      lowerCurveAnimationStartDelay.current === 0
        ? 0
        : t - lowerCurveAnimationStartDelay.current,
      tailEndX,
    );

    // orig vvv
    // M210 0.653122V160.986C161 126.5 78 93 13 80.5L0 73L7.5 59C80.5328 23.6588 146.706 8.98359 210 0.653122Z
    const path = `M${tailEndX} ${upperCurve.y} L${Math.max(
      lowerCurve.x,
      upperCurve.x,
    )} ${lowerCurve.verticalLineY}C${curveDataToString(
      lowerCurve,
    )}L${LOWER_START_RAY_X} ${LOWER_START_RAY_Y}L${UPPER_CURVE_START_X} ${UPPER_CURVE_START_Y}C${curveDataToString(
      upperCurve,
    )}Z`;

    console.dir({ path });

    starTailRef.current?.setAttribute('d', path);
  });

  return (
    <motion.svg
      width="210"
      height="161"
      viewBox="0 0 210 161"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ transform: 'translate(32px, 5px)' }}
      animate={{ transform: 'translate(-68px, 5px)' }}
      transition={{
        ease: 'linear',
        duration: 0.4,
      }}
      style={{ position: 'absolute' }}
    >
      <path ref={starTailRef} fill="#458FD6" />
    </motion.svg>
  );
}
