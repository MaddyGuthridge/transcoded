import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from 'bun:test';
import { scanLibrary } from '$lib/server/scanner';
import type { PresetInfo } from '$lib/server/handbrakePresets';

const presets: PresetInfo[] = [
  { id: 0, name: '1080p', file: '1080p.json', description: 'Example' },
  { id: 0, name: '2160p', file: '2160p.json', description: 'Example' },
];

const testCasesDir = __dirname;

const testCases = (await fs.readdir(testCasesDir, { withFileTypes: true }))
  .filter(dirEnt => dirEnt.isDirectory())
  .map(dirEnt => dirEnt.name);

test.each(testCases)('Scanner produces correct library scan: %s', async (directory) => {
  const staging = path.join(testCasesDir, directory, 'staging');
  const production = path.join(testCasesDir, directory, 'production');
  const expected = await Bun.file(path.join(testCasesDir, directory, 'expected.json')).json();

  expect(scanLibrary(
    1,
    'Test library',
    staging,
    production,
    presets,
  )).resolves.toStrictEqual(expected);
});
