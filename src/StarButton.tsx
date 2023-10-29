import { useState } from 'react';

import { FloatingStar } from './FloatingStar';
import { FlyingStar } from './FlyingStar';
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
    >
      {hover ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FlyingStar />
          <StarTail />
        </div>
      ) : (
        <FloatingStar />
      )}
    </button>
  );
}
