import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from 'bun:test';
import { scanLibrary } from '$lib/server/scanner';
import type { PresetInfo } from '$lib/server/handbrakePresets';
import type { MediaLibrary } from '$lib/server/scanner/types';

const presets: PresetInfo[] = [
  { id: 0, name: '1080p', file: '1080p.json', description: 'Example' },
  { id: 1, name: 'Surround 1080p', file: '1080p.json', description: 'Example' },
  { id: 2, name: '2160p', file: '2160p.json', description: 'Example' },
];

const defaultOutput: MediaLibrary = {
  id: 1,
  name: 'Test library',
  productionRoot: expect.any(String),
  stagingRoot: expect.any(String),
  items: [],
};

const testCasesDir = __dirname;

const testCases = (await fs.readdir(testCasesDir, { withFileTypes: true }))
  .filter(dirEnt => dirEnt.isDirectory())
  .filter(dirEnt => !dirEnt.name.startsWith('!'))
  .map(dirEnt => dirEnt.name);

test.concurrent.each(testCases)('Scanner produces correct library scan: %s', async (directory) => {
  const staging = path.join(testCasesDir, directory, 'staging');
  const production = path.join(testCasesDir, directory, 'production');
  const partialExpected = await Bun.file(path.join(testCasesDir, directory, 'expected.json')).json();

  const expected = { ...defaultOutput, ...partialExpected };

  const actual = await scanLibrary(
    1,
    'Test library',
    staging,
    production,
    presets,
  );

  expect(actual).toStrictEqual(expected);
});
