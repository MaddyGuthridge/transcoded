import { getData } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import * as z from 'zod';
import { enqueueTranscode } from '$lib/server/queue';
import path from 'node:path';
import { zodParse } from '$lib/components/helpers';

const QueueTranscodeOptions = z.object({
  libraryId: z.int(),
  itemId: z.int(),
  fileId: z.int(),
  presetId: z.int(),
});

export async function POST(req: RequestEvent) {
  const { libraryId, itemId, fileId, presetId }
    = zodParse(QueueTranscodeOptions, await req.request.json());
  const data = await getData();

  const lib = data.media.find(lib => lib.id === libraryId);
  if (!lib) error(400, 'Invalid library ID');
  const item = lib.items.find(item => item.id === itemId);
  if (!item) error(400, 'Invalid item ID');
  const file = item.files.find(f => f.id === fileId);
  if (!file) error(400, 'Invalid file ID');

  const preset = data.presets.find(p => p.id === presetId);
  if (!preset) error(400, 'Invalid preset ID');

  console.log('Error checks');

  const inputPath = path.join(lib.stagingRoot, item.path, file.path);

  const outputFileExtensionRegex = new RegExp(`\\.${path.extname(file.path)}$`);
  const fileWithoutExtension = file.path.replace(outputFileExtensionRegex, '');

  // If the file is not the main file, it should go in a subdirectory, so Jellyfin can tell
  // that it is not the main feature
  let outputSubdirectory = '';
  if (item.mainFile) {
    outputSubdirectory = fileWithoutExtension;
  }

  const outFileName = `${fileWithoutExtension} - [${preset.name}].${preset.fileExtension}`;
  const outputPath = path.join(lib.productionRoot, item.path, outputSubdirectory, outFileName);

  const jobId = enqueueTranscode(
    inputPath,
    outputPath,
    {
      file: path.join(data.config.handbrake.presets, preset.file),
      name: preset.name,
    },
  );

  return json({ jobId });
}
