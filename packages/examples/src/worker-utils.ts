/**
 * Simple lodash-like utilities for Web Worker use
 * This avoids the need to import lodash in workers
 */

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

export function map<T, U>(array: T[], iteratee: (value: T) => U): U[] {
  return array.map(iteratee);
}

export function formatResult(value: number): number {
  // In a real app, this might do more formatting
  return value;
}
