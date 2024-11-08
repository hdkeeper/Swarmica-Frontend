import { createContext, Context } from 'react';

import { AppAction, AppDispatch } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AppContext: Context<AppDispatch> = createContext((_: AppAction) => {});
