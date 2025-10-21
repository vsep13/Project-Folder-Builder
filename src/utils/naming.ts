export function normaliseJobNo(input: string): string | null {
  const digits = input.replace(/\D+/g, '');
  if (digits.length === 4) return `502${digits}`;
  if (digits.length === 7 && digits.startsWith('502')) return digits;
  return null;
}

export function slugify(input: string): string {
  const ascii = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return ascii
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_');
}

export function projectFolderName(jobNo: string, project: string): string {
  return `${jobNo}_${slugify(project)}`;
}
