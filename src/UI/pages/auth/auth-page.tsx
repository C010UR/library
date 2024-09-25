import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import ThemeToggle from '@/components/ui/theme-toggle';

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ThemeToggle />
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
