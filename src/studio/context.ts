import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

export const StudioUser = createContext<User | null>(null);

export function useStudioUser(): User {
  const user = useContext(StudioUser);
  if (!user) throw new Error('useStudioUser outside a signed-in Studio');
  return user;
}
