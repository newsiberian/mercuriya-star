import {
  LOWER_CURVE_END_Y,
  LOWER_CURVE_START_X,
  LOWER_CURVE_START_Y,
  UPPER_CURVE_END_Y,
  UPPER_CURVE_START_X,
  UPPER_CURVE_START_Y,
} from './constants.mjs';

export const curveDataToString = ({
  x1,
  y1,
  x2,
  y2,
  x,
  y,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}) => [x1, y1, x2, y2, x, y].join(' ');

export const toFixed = (number: number) => +number.toFixed(2);

function reverseAttenuationInSine(x: number): number {
  return 0.04 * Math.cos(x * Math.PI) * Math.cos(x * Math.PI);
}

function reverseAttenuationOutSine(x: number): number {
  return 0.04 * Math.sin(x * Math.PI) * Math.sin(x * Math.PI);
}

function easeInSine(x: number): number {
  return (
    1 -
    Math.cos((x * Math.PI) / 2) +
    reverseAttenuationInSine(x) +
    reverseAttenuationOutSine(x)
  );
}

function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2) - reverseAttenuationOutSine(x);
}

export const buildUpperCurve = (time: number, tailEndX: number) => {
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

export const buildLowerCurve = (time: number, tailEndX: number) => {
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
