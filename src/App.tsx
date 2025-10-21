import { useMemo, useState } from 'react';
import presetDefault from './presets/default';
import { Field } from './components/Field';
import FolderTree from './components/FolderTree';
import { FolderNode, Preset, Selection } from './types';
import { normaliseJobNo, projectFolderName } from './utils/naming';
import { defaultSelection, selectedSubtree } from './lib/selection';
import { buildZip, triggerDownload } from './utils/zip';
import { chooseClientDir, createManyDirs } from './utils/fs';

function flattenPaths(nodes: FolderNode[], sel: Selection, base: string[] = []) {
  return selectedSubtree(nodes, sel, base);
}

export default function App() {
  const [preset, setPreset] = useState<Preset>(presetDefault);
  const [includeGlobal, setIncludeGlobal] = useState<boolean>(presetDefault.includeGlobalAssetsByDefault ?? true);
  const [jobNoInput, setJobNoInput] = useState('');
  const [projectName, setProjectName] = useState('');
  const [sel, setSel] = useState<Selection>(() =>
    defaultSelection([...presetDefault.projectTree, ...presetDefault.globalAssets])
  );
  const [log, setLog] = useState<string[]>([]);

  const jobNo = normaliseJobNo(jobNoInput);
  const canBuild = Boolean(jobNo && projectName);

  const projectNameFolder = jobNo && projectName ? projectFolderName(jobNo, projectName) : '';

  const projectPaths = useMemo(
    () => flattenPaths(preset.projectTree, sel),
    [preset, sel]
  );
  const globalPaths = useMemo(
    () => (includeGlobal ? flattenPaths(preset.globalAssets, sel) : []),
    [preset, sel, includeGlobal]
  );

  function appendLog(lines: string[]) {
    setLog((prev) => [...prev, ...lines]);
  }

  async function onCreate() {
    const rootHandle = await chooseClientDir();
    const allPaths = projectPaths.map(p => [projectNameFolder, ...p]).concat(globalPaths);
    if (rootHandle) {
      const result = await createManyDirs(rootHandle, allPaths);
      appendLog([
        `Created ${result.created.length} folders.`,
        ...(result.errors.length ? [`Failed ${result.errors.length}.`] : []),
      ]);
      return;
    }
    const zip = await buildZip(allPaths, '');
    triggerDownload(zip, `${projectNameFolder || 'project'}_folders.zip`);
    appendLog([`Downloaded ZIP with ${allPaths.length} folders.`]);
  }

  async function onImportPreset(file: File) {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      const p: Preset = {
        name: json.name ?? 'Imported Preset',
        includeGlobalAssetsByDefault: json.includeGlobalAssetsByDefault ?? true,
        globalAssets: json.globalAssets ?? json.global_assets ?? [],
        projectTree: json.projectTree ?? json.project_tree ?? json.project ?? [],
      };
      setPreset(p);
      setIncludeGlobal(p.includeGlobalAssetsByDefault ?? true);
      setSel(defaultSelection([...p.projectTree, ...p.globalAssets]));
      appendLog([`Loaded preset: ${p.name}`]);
    } catch (e) {
      appendLog(['Failed to load preset: ' + (e as Error).message]);
    }
  }

  function onExportPreset() {
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (preset.name.replace(/\s+/g, '_') || 'preset') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Project Folder Builder (PWA)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Field label="Job No (502XXXX or last 4)">
          <input
            className="rounded-md bg-slate-800 px-3 py-2 outline-none"
            value={jobNoInput}
            onChange={(e) => setJobNoInput(e.target.value)}
            placeholder="5020900 or 0900"
            inputMode="numeric"
          />
          {jobNoInput && (
            <p className="text-xs text-slate-400 mt-1">
              {jobNo ? `Normalised: ${jobNo}` : 'Needs 502XXXX (7 digits) or last 4 digits.'}
            </p>
          )}
        </Field>

        <Field label="Project Name">
          <input
            className="rounded-md bg-slate-800 px-3 py-2 outline-none"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Flavour Page"
          />
          {jobNo && projectName && (
            <p className="text-xs text-slate-400 mt-1">Folder: {projectNameFolder}</p>
          )}
        </Field>

        <div className="flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-md px-4 py-2"
            disabled={!canBuild}
            onClick={onCreate}
            title={('showDirectoryPicker' in window) ? 'Create directly in a chosen folder' : 'Downloads a ZIP'}
          >
            {('showDirectoryPicker' in window) ? 'Create Folders…' : 'Download ZIP…'}
          </button>
          <label className="border border-slate-600 rounded-md px-3 py-2 cursor-pointer">
            Import Preset…
            <input type="file" accept="application/json" hidden onChange={e => e.target.files && onImportPreset(e.target.files[0])} />
          </label>
          <button className="border border-slate-600 rounded-md px-3 py-2" onClick={onExportPreset}>Export Preset</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700 p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Project Tree</h2>
          </div>
          <FolderTree nodes={preset.projectTree} sel={sel} setSel={setSel} />
        </div>
        <div className="rounded-lg border border-slate-700 p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Assets</h2>
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" checked={includeGlobal} onChange={() => setIncludeGlobal(!includeGlobal)} />
              Include Global Assets
            </label>
          </div>
          <FolderTree nodes={preset.globalAssets} sel={sel} setSel={setSel} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm text-slate-400 mb-2">Preview</h3>
        <pre className="text-xs bg-slate-900 rounded-lg p-3 overflow-auto max-h-48">
{projectPaths.map(p => [projectNameFolder, ...p].join('/')).concat(includeGlobal ? globalPaths.map(p => p.join('/')) : []).join('\n')}
        </pre>
      </div>

      <div className="mt-4">
        <h3 className="text-sm text-slate-400 mb-2">Log</h3>
        <pre className="text-xs bg-slate-900 rounded-lg p-3 overflow-auto max-h-48">
{log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
