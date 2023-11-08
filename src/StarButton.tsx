import { useState } from 'react';

import { FloatingStar } from './FloatingStar';
import { StarTail } from './StarTail';

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
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <FloatingStar hover={hover} />
      {hover && <StarTail />}
    </button>
  );
}
