import { useState } from 'react';

import { FloatingStar } from './FloatingStar/index.mjs';

export function StarButton() {
  const [hover, setHover] = useState(false);

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
    >
      <FloatingStar hover={hover} />
    </button>
  );
}
