import { ButtonHTMLAttributes, useState } from 'react';

import { FloatingStar } from './FloatingStar/index.mjs';

type StarButtonProps = Pick<Parameters<typeof FloatingStar>[0], 'text'> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function StarButton({ text, ...props }: StarButtonProps) {
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
      {...props}
    >
      <FloatingStar hover={hover} text={text} />
    </button>
  );
}
