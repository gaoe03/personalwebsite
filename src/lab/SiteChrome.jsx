import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export const portfolioNavLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Interests', href: '/#interests' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export const CustomCursor = () => {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(-40);
  const pointerY = useMotionValue(-40);
  const x = useSpring(pointerX, { stiffness: 650, damping: 42, mass: 0.28 });
  const y = useSpring(pointerY, { stiffness: 650, damping: 42, mass: 0.28 });
  const [visible, setVisible] = useState(false);
  const [overAction, setOverAction] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches || reducedMotion) return undefined;

    const handleMove = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
    };
    const handleTarget = (event) => {
      setOverAction(Boolean(event.target.closest('a, button, [data-cursor-action]')));
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerover', handleTarget, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerover', handleTarget);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [pointerX, pointerY, reducedMotion]);

  return (
    <motion.div
      className={`lab-custom-cursor${overAction ? ' is-action' : ''}`}
      style={{ x, y, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span />
    </motion.div>
  );
};

export const SiteNav = ({ links = portfolioNavLinks, trailingLink }) => (
  <nav className={`lab-nav${trailingLink ? ' has-actions' : ''}`} aria-label="Primary">
    <a href="/" className="lab-brand">
      <img src="/favicon.png" alt="" />
      Ethan Gao
    </a>
    <div className="lab-nav-links">
      {links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
    </div>
    {trailingLink && (
      <div className="lab-nav-actions">
        <a href={trailingLink.href} className="lab-original">{trailingLink.label}</a>
      </div>
    )}
  </nav>
);
