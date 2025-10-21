import { FolderNode, Selection } from '../types';

export function defaultSelection(nodes: FolderNode[], sel: Selection = {}, base: string[] = []): Selection {
  for (const n of nodes) {
    const key = [...base, n.name].join('/');
    const def = n.isOptional ? n.defaultSelected !== false : true;
    sel[key] = def;
    if (n.children) defaultSelection(n.children, sel, [...base, n.name]);
  }
  return sel;
}

export function selectedSubtree(nodes: FolderNode[], sel: Selection, base: string[] = []): string[][] {
  const paths: string[][] = [];
  for (const n of nodes) {
    const key = [...base, n.name].join('/');
    const chosen = n.isOptional ? !!sel[key] : true;
    if (!chosen) continue;
    const here = [...base, n.name];
    paths.push(here);
    if (n.children?.length) {
      for (const c of selectedSubtree(n.children, sel, here)) paths.push(c);
    }
  }
  return paths;
}
