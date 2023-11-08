import { StarPath } from './StarPath.tsx';
import { useStarBaseAnimation } from './useStarBaseAnimation.mjs';

export function FloatingStar({ hover }: { hover: boolean }) {
  const { starSvgRef } = useStarBaseAnimation(hover);

  return (
    <svg
      ref={starSvgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 54 54"
      width="52"
      height="52"
      fill="none"
    >
      <StarPath pauseAnimation={hover} />
    </svg>
  );
}
