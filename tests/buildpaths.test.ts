import { describe, it, expect } from 'vitest';
import preset from '../src/presets/default';
import { defaultSelection, selectedSubtree } from '../src/lib/selection';

describe('build paths', () => {
  it('selects default nodes', () => {
    const sel = defaultSelection([...preset.projectTree, ...preset.globalAssets]);
    const projectPaths = selectedSubtree(preset.projectTree, sel);
    expect(projectPaths.length).toBeGreaterThan(0);
  });
});
