import { describe, it, expect } from 'vitest';
import { normaliseJobNo, slugify, projectFolderName } from '../src/utils/naming';

describe('naming', () => {
  it('normalises last 4 digits', () => {
    expect(normaliseJobNo('0900')).toBe('5020900');
  });
  it('accepts full 7 digits', () => {
    expect(normaliseJobNo('5020900')).toBe('5020900');
  });
  it('slugifies project', () => {
    expect(slugify('Flavour Page')).toBe('flavour_page');
  });
  it('composes folder name', () => {
    expect(projectFolderName('5020900', 'Flavour Page')).toBe('5020900_flavour_page');
  });
});
