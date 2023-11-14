import { ButtonHTMLAttributes, useEffect, useState } from 'react';

import { FloatingStar } from './FloatingStar/index.mjs';
import { StarTailContext } from './StarTail/StarTailContext.mjs';
import { useCurveBuildersCache } from './StarTail/useCurveBuildersCache.mjs';
import Worker from './worker.mjs?worker';

type StarButtonProps = Pick<Parameters<typeof FloatingStar>[0], 'text'> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function StarButton({ text, ...props }: StarButtonProps) {
  const [hover, setHover] = useState(false);
  const {
    upperCurveBuilderCache,
    setUpperCurveBuilderCache,
    lowerCurveBuilderCache,
    setLowerCurveBuilderCache,
  } = useCurveBuildersCache();

  useEffect(() => {
    const worker = new Worker();

    worker.onmessage = function (ev) {
      setUpperCurveBuilderCache(ev.data.upperCurveBuilderCache);
      setLowerCurveBuilderCache(ev.data.lowerCurveBuilderCache);
      this.terminate();
    };

    return () => worker.terminate();
  }, [setUpperCurveBuilderCache]);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <button
      className="star-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <StarTailContext.Provider
        value={{ upperCurveBuilderCache, lowerCurveBuilderCache }}
      >
        <FloatingStar hover={hover} text={text} />
      </StarTailContext.Provider>
    </button>
  );
}
