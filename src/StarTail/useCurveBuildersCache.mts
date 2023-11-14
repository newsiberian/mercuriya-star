import { useState } from 'react';
import { buildUpperCurve, buildLowerCurve } from './utils/curveBuilders.mjs';

export function useCurveBuildersCache() {
  const [upperCurveBuilderCache, setUpperCurveBuilderCache] =
    useState<Map<string, ReturnType<typeof buildUpperCurve>>>();
  const [lowerCurveBuilderCache, setLowerCurveBuilderCache] =
    useState<Map<string, ReturnType<typeof buildLowerCurve>>>();

  return {
    upperCurveBuilderCache,
    setUpperCurveBuilderCache,
    lowerCurveBuilderCache,
    setLowerCurveBuilderCache,
  };
}
