/**
 * Config file loading
 */
import yaml from 'yaml';
import * as log from './log';
import * as z from 'zod';

export const Config = z.object({
  libraries: z.array(z.object({
    /** Name of the library */
    name: z.string(),
    /** Path to library's staging directory */
    staging: z.string(),
    /** Path to library's production directory */
    production: z.string(),
  })),
  handbrake: z.object({
    /** Path to Handbrake presets directory */
    presets: z.string(),
    /** Number of encode threads for Handbrake to use */
    threads: z.int(),
  }),
});

export type Config = z.Infer<typeof Config>;

export const CONFIG = process.env.TRANSCODED_CONFIG ?? 'config.yaml';

export async function getConfig() {
  log.write(`Load config file '${CONFIG}'`);
  return Config.parse(yaml.parse(await Bun.file(CONFIG).text()));
}
