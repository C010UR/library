import * as React from 'react';

import UserContext from '@/components/providers/user/user-context';
import {User} from "@/types/types";

export function useUser(): User {
  const user = React.useContext(UserContext);

  if (user === undefined) {
    throw new Error(
      "Couldn't find a user. Is your component inside the UserProvider and the user is authenticated?",
    );
  }

  return user;
}
