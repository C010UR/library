import * as React from 'react';

import type { Theme } from '@/types/theme';

const ThemeContext = React.createContext<Theme | undefined>(undefined);

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
