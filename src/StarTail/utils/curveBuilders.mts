import { useMemo } from 'react';

import {
  CURVE_CACHE_SIZE,
  LOWER_CURVE_END_Y,
  LOWER_CURVE_START_X,
  LOWER_CURVE_START_Y,
  UPPER_CURVE_END_Y,
  UPPER_CURVE_START_X,
  UPPER_CURVE_START_Y,
} from '../constants.mjs';
import { easeInSine, easeOutSine } from './easings.mjs';
import { toFixed } from './utils.mjs';
import { useStarTailContext } from '../StarTailContext.mjs';

function curveBuilder<
  BuilderReturnType extends ReturnType<
    typeof buildUpperCurve | typeof buildLowerCurve
  >,
>(
  builder: (...args: [number, number]) => BuilderReturnType,
  externalCache?: Map<string, BuilderReturnType>,
) {
  const cache = externalCache || new Map<string, BuilderReturnType>();

  return (...args: [number, number]) => {
    if (cache.has(args.toString())) {
      const cachedResult = cache.get(args.toString());

      if (cachedResult) {
        console.log(
          `Result for ${builder.name} returned from cache (size: ${cache.size})`,
          args,
        );
        return cachedResult;
      }
    }

    console.log(builder.name, ...args);

    const result = builder(...args);

    if (cache.size <= CURVE_CACHE_SIZE) {
      cache.set(args.toString(), result);
    }

    return result;
  };
}

const buildUpperCurve = (time: number, tailEndX: number) => {
  const horizontalCurveLength = tailEndX - UPPER_CURVE_START_X;
  // C(t) = A + (B - A) * (t / Tmax)
  const y = toFixed(
    UPPER_CURVE_START_Y +
      (UPPER_CURVE_END_Y - UPPER_CURVE_START_Y) * easeOutSine(time),
  );

  // length = sqrt(L^2 + (h2 - h1)^2)
  const curveLength = Math.sqrt(
    Math.pow(horizontalCurveLength, 2) + Math.pow(y - UPPER_CURVE_START_Y, 2),
  );

  // for a simplicity we assume that each control point has length of a third
  // part of a curve
  const controlPointOneLength = curveLength / 2.6;
  const controlPointTwoLength = curveLength / 3.2;

  const x1 = toFixed(UPPER_CURVE_START_X + controlPointOneLength);

  // x = L * (distance between A and C) / (distance between A and B)
  const fraction1 =
    (horizontalCurveLength * (x1 - UPPER_CURVE_START_X)) /
    horizontalCurveLength;

  // hC = h1 + (h2 - h1) * (x / L)
  const y1 = toFixed(
    UPPER_CURVE_START_Y +
      (y - UPPER_CURVE_START_Y) *
        ((fraction1 + fraction1 * 0.54) / horizontalCurveLength || 0),
  );

  const x2 = toFixed(tailEndX - controlPointTwoLength);

  const fraction2 =
    (horizontalCurveLength * (x2 - UPPER_CURVE_START_X)) /
    horizontalCurveLength;

  const y2 = toFixed(
    UPPER_CURVE_START_Y +
      (y - UPPER_CURVE_START_Y) *
        ((fraction2 + fraction2 * 0.2) / horizontalCurveLength || 0),
  );

  return { x1, y1, x2, y2, x: tailEndX, y };
};

const buildLowerCurve = (time: number, tailEndX: number) => {
  const horizontalCurveLength = tailEndX - LOWER_CURVE_START_X;

  // C(t) = A + (B - A) * (t / Tmax)
  const verticalLineY = toFixed(
    time === 0
      ? LOWER_CURVE_START_Y
      : LOWER_CURVE_START_Y +
          (LOWER_CURVE_END_Y - LOWER_CURVE_START_Y) * easeInSine(time),
  );

  const curveLength = Math.sqrt(
    Math.pow(Math.max(horizontalCurveLength, 0), 2) +
      Math.pow(LOWER_CURVE_START_Y - LOWER_CURVE_START_Y, 2),
  );

  const controlPointOneLength = curveLength / 2.5;
  const controlPointTwoLength = curveLength / 3.3;

  const x2 = toFixed(LOWER_CURVE_START_X + controlPointOneLength);

  const fraction2 =
    (horizontalCurveLength * (x2 - LOWER_CURVE_START_X)) /
    horizontalCurveLength;

  // hC = h1 + (h2 - h1) * (x / L)
  const y2 = toFixed(
    LOWER_CURVE_START_Y +
      (verticalLineY - LOWER_CURVE_START_Y) *
        ((fraction2 - fraction2 * 0.4) / horizontalCurveLength || 0),
  );

  const x1 = toFixed(
    Math.max(tailEndX, LOWER_CURVE_START_X) - controlPointTwoLength,
  );

  const fraction1 =
    (horizontalCurveLength * (x1 - LOWER_CURVE_START_X)) /
    horizontalCurveLength;

  const y1 = toFixed(
    LOWER_CURVE_START_Y +
      (verticalLineY - LOWER_CURVE_START_Y) *
        ((fraction1 - fraction1 * 0.33) / horizontalCurveLength || 0),
  );

  return {
    x1,
    y1,
    x2,
    y2,
    x: LOWER_CURVE_START_X,
    y: LOWER_CURVE_START_Y,
    verticalLineY,
  };
};

const cacheableBuildUpperCurve = curveBuilder(buildUpperCurve);
const cacheableBuildLowerCurve = curveBuilder(buildLowerCurve);

export {
  cacheableBuildUpperCurve as buildUpperCurve,
  cacheableBuildLowerCurve as buildLowerCurve,
};

export function useCurvesBuilders() {
  const { upperCurveBuilderCache, lowerCurveBuilderCache } =
    useStarTailContext();

  const buildUpperCurveCallback = useMemo(
    () => curveBuilder(buildUpperCurve, upperCurveBuilderCache),
    [upperCurveBuilderCache],
  );

  const buildLowerCurveCallback = useMemo(
    () => curveBuilder(buildLowerCurve, lowerCurveBuilderCache),
    [lowerCurveBuilderCache],
  );

  return {
    buildUpperCurve: buildUpperCurveCallback,
    buildLowerCurve: buildLowerCurveCallback,
  };
}
