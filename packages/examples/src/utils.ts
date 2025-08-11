export function formatResult(value: number): string {
  return `The result is: ${value}`;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

export function map<T, U>(array: T[], iteratee: (value: T) => U): U[] {
  return array.map(iteratee);
}
