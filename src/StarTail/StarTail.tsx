import { useRef } from 'react';
import { useAnimationFrame } from 'framer-motion';

import {
  LOWER_START_RAY_X,
  LOWER_START_RAY_Y,
  PAUSE_DURATION,
  TAIL_END_X,
  UPPER_CURVE_START_X,
  UPPER_CURVE_START_Y,
} from './constants.mjs';
import { useCurvesBuilders } from './utils/curveBuilders.mjs';
import { curveDataToString, toFixed } from './utils/utils.mjs';

export function StarTail() {
  const starTailRef = useRef<SVGPathElement>(null);
  const { buildLowerCurve, buildUpperCurve } = useCurvesBuilders();

  useAnimationFrame(time => {
    if (time >= PAUSE_DURATION) {
      return;
    }

    // we can't afford having time = 0 here, because vertical line will be too short
    const t = toFixed(time / PAUSE_DURATION, 4);

    // we assume that starting point ("x") should be in parallel w/ lower curve "x"
    // because its located righter than upper curve starting "x"
    const tailEndX = toFixed(
      UPPER_CURVE_START_X + (TAIL_END_X - UPPER_CURVE_START_X) * t,
    );

    // compute tail movement here
    const upperCurve = buildUpperCurve(t, tailEndX);
    const lowerCurve = buildLowerCurve(t, tailEndX);

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

    starTailRef.current?.setAttribute('d', path);
  });

  return <path ref={starTailRef} fill="#458FD6" />;
}
