/**
 * Gera um id unico.
 * @example const id = generateUniqueId();
 * @returns Um ID unico.
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).slice(2, 9);
}
