import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Fade-up entrance triggered when the element scrolls into view.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(delay, 0.5), ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
