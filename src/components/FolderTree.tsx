import { FolderNode, Selection } from '../types';

function NodeRow({
  node,
  path,
  sel,
  setSel,
}: {
  node: FolderNode;
  path: string[];
  sel: Selection;
  setSel: (s: Selection) => void;
}) {
  const key = path.join('/');
  const checked = node.isOptional ? !!sel[key] : true;

  return (
    <div className="pl-2">
      <label className="inline-flex items-center gap-2">
        {node.isOptional ? (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setSel({ ...sel, [key]: !checked })}
          />
        ) : (
          <span className="inline-block w-4 text-center">✓</span>
        )}
        <span>{node.name}</span>
      </label>
      {checked && node.children?.length ? (
        <div className="pl-4 mt-1 flex flex-col gap-1">
          {node.children.map((c) => (
            <NodeRow key={[...path, c.name].join('/')} node={c} path={[...path, c.name]} sel={sel} setSel={setSel} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function FolderTree({
  nodes,
  sel,
  setSel,
}: {
  nodes: FolderNode[];
  sel: Selection;
  setSel: (s: Selection) => void;
}) {
  return (
    <div className="text-sm">
      {nodes.map((n) => (
        <NodeRow key={n.name} node={n} path={[n.name]} sel={sel} setSel={setSel} />
      ))}
    </div>
  );
}
