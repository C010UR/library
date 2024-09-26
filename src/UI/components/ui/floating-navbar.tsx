import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ui/theme-toggle.tsx';
import Profile from '@/components/ui/profile.tsx';
import { useUser } from '@/components/providers/user/use-user.tsx';
import { NavbarLink } from '@/types/types';

const FloatingNav = ({ navItems }: { navItems: NavbarLink[] }) => {
  const { scrollYProgress } = useScroll();
  const user = useUser();

  const [visible, setVisible] = useState(false);

  if (document.body.clientHeight > window.innerHeight) {
    useMotionValueEvent(scrollYProgress, 'change', (current) => {
      // Check if current is not undefined and is a number
      if (typeof current === 'number') {
        let direction = current! - scrollYProgress.getPrevious()!;

        if (scrollYProgress.get() < 0.05) {
          setVisible(false);
        } else if (direction > 0) {
          setVisible(true);
        }
      }
    });
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="flex max-w-fit fixed top-5 inset-x-0 mx-auto border border-transparent dark:border-border rounded-full bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-10 pr-2 pl-8 py-2 items-center justify-center space-x-4"
      >
        {navItems.map((navItem: NavbarLink, idx: number) => (
          <motion.div whileHover={{ scale: 1.1 }} key={idx}>
            <Link
              key={`link=${idx}`}
              to={navItem.link}
              className={cn(
                'relative items-center flex space-x-1 hover:text-primary ',
              )}
            >
              <span className="block">{navItem.icon}</span>
              <span className="block text-sm">{navItem.name}</span>
            </Link>
          </motion.div>
        ))}
        <div>|</div>
        <div className="flex items-center justify-center space-x-2">
          <ThemeToggle size="sm" />
          <Profile user={user} size="sm" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export { FloatingNav };
