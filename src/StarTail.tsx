import { useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

const TAIL_END_X = 210;

const UPPER_CURVE_START_X = 7.5;
const UPPER_CURVE_START_Y = 59;
const UPPER_CURVE_END_Y = 0.653;

const LOWER_CURVE_START_X = 13;
const LOWER_CURVE_START_Y = 80.5;
const LOWER_CURVE_END_Y = 161;

const LOWER_START_RAY_X = 0;
const LOWER_START_RAY_Y = 73;

const PAUSE_DURATION = 400;

const curveDataToString = ({
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

const toFixed = (number: number) => +number.toFixed(2);

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
