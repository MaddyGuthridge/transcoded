/**
 * Config file loading
 */
import yaml from 'yaml';
import * as log from './log';

export type Config = {
  libraries: {
    /** Name of the library */
    name: string,
    /** Path to library's staging directory */
    staging: string,
    /** Path to library's production directory */
    production: string,
  }[],
  handbrake: {
    /** Path to Handbrake presets directory */
    presets: string,
    /** Number of encode threads for Handbrake to use */
    threads: number,
  },
};

export const CONFIG = process.env.TRANSCODED_CONFIG ?? 'config.yaml';

export async function getConfig() {
  log.write(`Load config file '${CONFIG}'`);
  return yaml.parse(await Bun.file(CONFIG).text()) as Config;
}
