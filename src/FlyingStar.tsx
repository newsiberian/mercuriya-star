import { motion } from 'framer-motion';

import { paths } from './StarPath';

export function FlyingStar() {
  // initial
  // translate(15px, 52px)
  // translate(-32px, -5px)
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      // viewBox="-2 -2 52 52"
      width="48"
      height="48"
      fill="none"
      initial={{ transform: 'translate(0px, -5px)' }}
      animate={{ transform: 'translate(-32px, -5px)' }}
      transition={{
        delay: 0.23,
        duration: 0.15,
      }}
    >
      <path fill="#F7B21A" fillRule="evenodd" clipRule="evenodd" d={paths[0]} />
    </motion.svg>
  );
}
