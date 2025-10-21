import { Preset } from '../types';

const preset: Preset = {
  name: 'Original Design Schema',
  includeGlobalAssetsByDefault: true,
  globalAssets: [
    {
      name: '02_Global_Assets (Not Project Specific)',
      children: [
        { name: '01_Logos' },
        { name: '02_Fonts' },
        { name: '03_Icons', isOptional: true, defaultSelected: true },
        { name: '04_Images' },
        { name: 'Getty_Licenced', isOptional: true, defaultSelected: true },
        { name: '05_Guidelines' }
      ]
    }
  ],
  projectTree: [
    {
      name: '01_Admin',
      children: [
        { name: 'Brief' },
        { name: 'Quote' },
        { name: 'Supplied Files' },
        { name: 'Approval', isOptional: true, defaultSelected: true },
        { name: 'Meeting Notes', isOptional: true, defaultSelected: true },
        { name: 'Client Feedback', isOptional: true, defaultSelected: true },
        { name: 'Reports', isOptional: true },
        { name: 'Case Study', isOptional: true }
      ]
    },
    {
      name: '02_Assets',
      children: [{ name: '01_Links' }, { name: '02_Fonts' }]
    },
    {
      name: '03_Design',
      children: [
        {
          name: '01_Discover',
          isOptional: true,
          defaultSelected: true,
          children: [{ name: 'Workshop' }, { name: 'Playback' }]
        },
        { name: '02_Concepts', children: [{ name: 'Touchpoint' }] },
        { name: '03_Design Dev', children: [{ name: 'Touchpoint' }] },
        { name: '04_Artwork', children: [{ name: 'Touchpoint' }] },
        {
          name: '05_Motion',
          isOptional: true,
          defaultSelected: true,
          children: [{ name: 'Edit' }, { name: 'Animation' }, { name: 'Audio' }, { name: 'Renders' }]
        }
      ]
    }
  ]
};

export default preset;
