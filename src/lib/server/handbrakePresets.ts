import fs from 'node:fs/promises';
import path from 'node:path';
import * as log from './log';

/**
 * Information about a preset
 */
export type PresetInfo = {
  id: number,
  /** File that the preset originated from */
  file: string,
  /** Name of the preset */
  name: string,
  /** Description of the preset */
  description: string,
  /** File extension for output files produced by this preset (eg ".mp4") */
  fileExtension: string,
};

const fileFormatToExtension: Record<string, string> = {
  'av_mp4': '.mp4',
  'av_mkv': '.mkv',
};

/**
 * Partial type definition for a single Handbrake preset within a file
 *
 * Note that a preset file actually contains a list of these.
 */
type HandbrakePreset = {
  PresetDescription: string,
  PresetName: string,
  FileFormat: string,
};

/** Partial type definition for a handbrake preset file */
type HandbrakePresetFile = {
  PresetList: HandbrakePreset[],
};

/**
 * From the given preset file, load its info
 */
async function loadPresetFile(
  presetsDir: string,
  file: string,
): Promise<HandbrakePresetFile> {
  return Bun.file(path.join(presetsDir, file)).json() as Promise<HandbrakePresetFile>;
}

/**
 * Given a presets directory, find all presets within that directory, returning information about
 * them.
 */
export async function findPresets(presetsDir: string): Promise<PresetInfo[]> {
  log.write(`Finding preset files in ${presetsDir}...`);
  const presetFiles = (await fs.readdir(presetsDir, { recursive: true, withFileTypes: true }))
    .filter(f => f.isFile())
    .filter(f => path.extname(f.name) === '.json')
    .map(f => path.join(path.relative(presetsDir, f.parentPath), f.name));

  const presets: PresetInfo[] = [];

  for (const f of presetFiles) {
    const filePresets = await loadPresetFile(presetsDir, f);

    for (const preset of filePresets.PresetList) {
      presets.push({
        id: presets.length,
        file: f,
        name: preset.PresetName,
        description: preset.PresetDescription,
        fileExtension: fileFormatToExtension[preset.FileFormat],
      });
    }
  }

  return presets.toSorted((a, b) => a.name.localeCompare(b.name));
}
