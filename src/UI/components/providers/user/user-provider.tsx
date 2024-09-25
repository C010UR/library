import * as React from 'react';

import UserContext from '@/components/providers/user/user-context';
import { User } from '@/types/types';

type Props = {
  value: User | undefined;
  children: React.ReactNode;
};

export default function ThemeProvider({ value, children }: Props) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
