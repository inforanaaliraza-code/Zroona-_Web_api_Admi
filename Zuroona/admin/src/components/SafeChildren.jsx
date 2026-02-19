'use client';

/**
 * SafeChildren - Prevents DOM nodes (e.g. HTMLImageElement) from being rendered as React children.
 * Some dependencies (e.g. Chart.js) may put Image() instances into state; this filters them at the root.
 */

import { Children } from 'react';

function isDOMNode(value) {
  if (typeof window === 'undefined') return false;
  return value && typeof value === 'object' && value.nodeType != null;
}

export default function SafeChildren({ children }) {
  const sanitized = Children.map(children, (child) => {
    if (child == null) return child;
    if (isDOMNode(child)) return null;
    return child;
  });
  return sanitized;
}
