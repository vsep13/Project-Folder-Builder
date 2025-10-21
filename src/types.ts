export type FolderNode = {
  name: string;
  isOptional?: boolean;
  defaultSelected?: boolean;
  children?: FolderNode[];
};

export type Preset = {
  name: string;
  includeGlobalAssetsByDefault?: boolean;
  globalAssets: FolderNode[];
  projectTree: FolderNode[];
};

export type Selection = Record<string, boolean>;
