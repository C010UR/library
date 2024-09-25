import * as React from 'react';

import type { User } from '@/types/types';

const UserContext = React.createContext<User | null>(null);

UserContext.displayName = 'UserContext';

export default UserContext;
