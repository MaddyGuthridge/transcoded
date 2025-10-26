import fs from 'node:fs/promises';
import path from 'node:path';
import {expect, test} from 'bun:test';
import { scanLibrary } from '$lib/server/scanner';

const presets = ['1080p', '2160p'];

const testCasesDir = __dirname;

const testCases = (await fs.readdir(testCasesDir, { withFileTypes: true }))
  .filter(dirEnt => dirEnt.isDirectory())
  .map(dirEnt => dirEnt.name);

test.each(testCases)(`Scanner produces correct library scan: %s`, async directory => {
  const staging = path.join(testCasesDir, directory, 'staging');
  const production = path.join(testCasesDir, directory, 'production');
  const expected = await Bun.file(path.join(testCasesDir, directory, 'expected.json')).json();

  expect(scanLibrary(staging, production, presets)).resolves.toStrictEqual(expected);
});
