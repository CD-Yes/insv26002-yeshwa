/** Convert an arbitrary string to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Ensure a slug is unique against a set of existing slugs. */
export function uniqueSlug(base: string, existing: Iterable<string>): string {
  const set = new Set(existing);
  const root = slugify(base) || 'item';
  if (!set.has(root)) return root;
  let i = 2;
  while (set.has(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}
