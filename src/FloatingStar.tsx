import { StarPath } from './StarPath.tsx';
import { useStarBaseAnimation } from './useStarBaseAnimation';

export function FloatingStar() {
  const { starSvgRef } = useStarBaseAnimation(false);

  return (
    <svg
      ref={starSvgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 52 52"
      width="48"
      height="48"
      fill="none"
    >
      <StarPath pauseAnimation={false} />
    </svg>
  );
}
