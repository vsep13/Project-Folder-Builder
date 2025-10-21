// Real folder creation via File System Access API (Chrome/Edge)
export async function chooseClientDir(): Promise<FileSystemDirectoryHandle | null> {
  if (!('showDirectoryPicker' in window)) return null;
  // @ts-expect-error browser types vary
  return await window.showDirectoryPicker({ mode: 'readwrite' });
}

export async function ensurePath(root: FileSystemDirectoryHandle, segments: string[]) {
  let dir = root;
  for (const seg of segments) {
    dir = await dir.getDirectoryHandle(seg, { create: true });
  }
}

export async function createManyDirs(
  root: FileSystemDirectoryHandle,
  paths: string[][]
): Promise<{ created: string[][]; errors: string[][] }> {
  const created: string[][] = [];
  const errors: string[][] = [];
  for (const p of paths) {
    try {
      await ensurePath(root, p);
      created.push(p);
    } catch {
      errors.push(p);
    }
  }
  return { created, errors };
}
