import * as React from 'react';

import ThemeContext from '@/components/providers/theme/theme-context';
import { Theme } from '@/types/theme';

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const theme = new Theme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
