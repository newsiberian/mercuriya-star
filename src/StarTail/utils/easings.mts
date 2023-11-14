function reverseAttenuationInSine(x: number): number {
  return 0.04 * Math.cos(x * Math.PI) * Math.cos(x * Math.PI);
}

function reverseAttenuationOutSine(x: number): number {
  return 0.04 * Math.sin(x * Math.PI) * Math.sin(x * Math.PI);
}

export function easeInSine(x: number): number {
  return (
    1 -
    Math.cos((x * Math.PI) / 2) +
    reverseAttenuationInSine(x) +
    reverseAttenuationOutSine(x)
  );
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2) - reverseAttenuationOutSine(x);
}
