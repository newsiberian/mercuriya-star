import { createContext, useContext } from 'react';

import { useCurveBuildersCache } from './useCurveBuildersCache.mjs';

export const StarTailContext = createContext<Pick<
  ReturnType<typeof useCurveBuildersCache>,
  'upperCurveBuilderCache' | 'lowerCurveBuilderCache'
> | null>(null);

export function useStarTailContext() {
  const context = useContext(StarTailContext);

  if (!context) {
    throw new Error('No "StarTailContext" context provided');
  }

  return context;
}
