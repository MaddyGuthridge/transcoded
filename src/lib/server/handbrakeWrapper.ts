import { execa } from 'execa';
import type { Readable } from 'node:stream';
import { getConfig } from './config';

const handbrakeCli = 'HandBrakeCLI';

type ProgressBase = { message: string };

type ProgressWithPercent = ProgressBase & {
  percent: number,
};

type ProgressWithEta = ProgressBase & ProgressWithPercent & {
  fps: {
    current: number,
    average: number,
  },
  eta: {
    hours: number,
    minutes: number,
    seconds: number,
  },
};

export type HandbrakeProgressEvent = ProgressBase | ProgressWithEta | ProgressWithPercent;

export async function handbrake(
  input: string,
  output: string,
  preset: {
    file: string,
    name: string,
  },
  abort: AbortSignal,
  onProgress: (progress: HandbrakeProgressEvent) => void,
  onLog: (log: string) => void,
): Promise<number> {
  const config = await getConfig();
  const process = execa({ cancelSignal: abort })`${handbrakeCli}
    -x threads=${config.handbrake.threads}
    --input ${input}
    --output ${output}
    --preset-import-file ${preset.file}
    -Z ${preset.name}`;

  async function stdout() {
    for await (const line of splitByDelimiter(process.stdout, '\r')) {
      onProgress(parseProgress(line));
    }
  }

  async function stderr() {
    for await (const line of splitByDelimiter(process.stderr, '\n')) {
      onLog(line);
    }
  }

  await Promise.all([
    stdout(),
    stderr(),
  ]);

  return (await process).exitCode!;
}

export function parseProgress(line: string): HandbrakeProgressEvent {
  // Encoding: task 1 of 1, 0.16 %
  const simpleProgress = /^Encoding: task \d+ of \d+, (?<percent>\d+.\d+) %$/;
  // Encoding: task 1 of 1, 0.17 % (35.56 fps, avg 49.69 fps, ETA 00h42m25s)
  const fullProgress = /^Encoding: task \d+ of \d+, (?<percent>\d+.\d+) % \((?<fps>\d+.\d+) fps, avg (?<avg>\d+.\d+) fps, ETA (?<hh>\d+)h(?<mm>\d+)m(?<ss>\d+)s\)$/;

  const simpleMatch = simpleProgress.exec(line);
  const fullMatch = fullProgress.exec(line);
  if (simpleMatch !== null) {
    return {
      message: line,
      percent: parseFloat(simpleMatch.groups!.percent),
    };
  } else if (fullMatch) {
    return {
      message: line,
      percent: parseFloat(fullMatch.groups!.percent),
      fps: {
        current: parseFloat(fullMatch.groups!.fps),
        average: parseFloat(fullMatch.groups!.avg),
      },
      eta: {
        hours: parseInt(fullMatch.groups!.hh),
        minutes: parseInt(fullMatch.groups!.mm),
        seconds: parseInt(fullMatch.groups!.ss),
      },
    };
  } else {
    return { message: line };
  }
}

/**
 * Split the given stream based on the given delimiter
 *
 * Handbrake delimits its progress messages using `\r`, which execa doesn't support directly.
 * As such, we need to manually split the stream.
 *
 * Based on https://github.com/sindresorhus/execa/issues/1210#issuecomment-3448664071
 */
export async function* splitByDelimiter(stream: Readable, delimiter: string | RegExp) {
  let buffer = '';

  for await (const chunk of stream) {
    buffer += chunk;
    const parts = buffer.split(delimiter);
    buffer = parts.pop()!;

    for (const part of parts) {
      if (part) {
        yield part;
      }
    }
  }

  if (buffer) {
    yield buffer;
  }
}
