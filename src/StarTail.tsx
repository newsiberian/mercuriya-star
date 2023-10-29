import { motion } from 'framer-motion';

export function StarTail() {
  return (
    <motion.svg
      width="210"
      height="161"
      viewBox="0 0 210 161"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ transform: 'translateX(210px)' }}
      animate={{ transform: 'translateX(0px)' }}
      transition={{
        ease: 'linear',
        duration: 0.3,
      }}
      style={{ position: 'absolute' }}
    >
      <path
        fill="#458FD6"
        d="M210 .653v160.333C161 126.5 78 93 13 80.5L0 73l7.5-14C80.533 23.659 146.706 8.984 210 .653Z"
      />
    </motion.svg>
  );
}
