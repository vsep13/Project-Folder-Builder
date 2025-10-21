import JSZip from 'jszip';

export async function buildZip(paths: string[][], rootFolder: string): Promise<Blob> {
  const zip = new JSZip();
  for (const p of paths) {
    zip.folder([rootFolder, ...p].join('/'));
  }
  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
