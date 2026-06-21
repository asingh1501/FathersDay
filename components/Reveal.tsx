"use client";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
