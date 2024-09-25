import * as React from 'react';

import ThemeContext from '@/components/providers/theme/theme-context';
import { Theme } from '@/types/theme';

export function useTheme(): Theme {
  const theme = React.useContext(ThemeContext);

  if (theme === undefined) {
    throw new Error(
      "Couldn't find a theme. Is your component inside ThemeProvider?",
    );
  }

  return theme;
}
