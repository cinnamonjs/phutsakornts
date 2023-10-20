import { motion } from 'framer-motion';
import { textContainer, textVariant2 } from '@/utils/motion';

type TypingTextProps = {
    title: string;
    textStyles: string;
  };

export const TypingText: React.FC<TypingTextProps> = ({ title, textStyles }) => (
  <motion.p
    variants={textContainer}
    className={`${textStyles}`}
  >
    {Array.from(title).map((letter, index) => (
      <motion.span variants={textVariant2(0)} key={index}>
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))}
  </motion.p>
);