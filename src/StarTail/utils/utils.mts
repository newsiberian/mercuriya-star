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

export const toFixed = (number: number, fraction = 2) =>
  +number.toFixed(fraction);
