import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect that does not show warning when server-side rendering.
 */

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
