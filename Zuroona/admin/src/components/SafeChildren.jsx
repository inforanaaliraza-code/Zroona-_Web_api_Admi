'use client';

/**
 * SafeChildren - Prevents DOM nodes (e.g. HTMLImageElement) from being rendered as React children.
 * Filters any direct child that is a DOM node so "Objects are not valid as a React child" never occurs at root.
 */

import { Children } from 'react';

function isDOMNode(value) {
  if (value == null || typeof value !== 'object') return false;
  if (typeof window === 'undefined') return false;
  return value.nodeType != null;
}

function isInvalidObjectChild(value) {
  if (value == null) return false;
  if (typeof value !== 'object') return false;
  if (value.$$typeof != null) return false;
  return isDOMNode(value) || (typeof value.nodeType !== 'undefined');
}

export default function SafeChildren({ children }) {
  const sanitized = Children.map(children, (child) => {
    if (child == null) return child;
    if (isDOMNode(child)) return null;
    if (isInvalidObjectChild(child)) return null;
    return child;
  });
  return sanitized;
}
