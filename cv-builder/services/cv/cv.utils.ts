// services/cv/cv.utils.ts — General CV utilities and business logic

/**
 * Reorders an item in an array from one index to another (mutates the array).
 */
export function moveItemInArray<T>(arr: T[], from: number, to: number): void {
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
}

/**
 * Formats a month and year into a readable string.
 */
export function formatMonthYear(month: number, year: number): string {
  if (month === 0) return `${year}`
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
