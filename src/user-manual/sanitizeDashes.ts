export function sanitizeDashes(input: string): string {
  return input
    .replace(/\s—\s/g, ' → ')
    .replace(/—/g, ' - ');
}
