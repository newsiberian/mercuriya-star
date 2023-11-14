import {
  CURVE_CACHE_SIZE,
  TAIL_END_X,
  UPPER_CURVE_START_X,
} from './StarTail/constants.mjs';
import {
  buildLowerCurve,
  buildUpperCurve,
} from './StarTail/utils/curveBuilders.mjs';
import { toFixed } from './StarTail/utils/utils.mjs';

function fulfilCurvesWorker() {
  const upperCurveBuilderCache = new Map<
    string,
    ReturnType<typeof buildUpperCurve>
  >();
  const lowerCurveBuilderCache = new Map<
    string,
    ReturnType<typeof buildUpperCurve>
  >();

  for (let i = 0; i <= CURVE_CACHE_SIZE; i++) {
    const t = toFixed(i / CURVE_CACHE_SIZE, 4);
    const tailEndX = toFixed(
      UPPER_CURVE_START_X + (TAIL_END_X - UPPER_CURVE_START_X) * t,
    );

    const key = [t, tailEndX].toString();
    upperCurveBuilderCache.set(key, buildUpperCurve(t, tailEndX));
    lowerCurveBuilderCache.set(key, buildLowerCurve(t, tailEndX));
  }

  postMessage({ upperCurveBuilderCache, lowerCurveBuilderCache });
}

fulfilCurvesWorker();
