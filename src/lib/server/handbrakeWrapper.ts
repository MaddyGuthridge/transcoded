import { execa } from "execa";
import path from "node:path";
import { promisify } from "node:util";
import { Tail } from "tail";
import { dir } from "tmp";

/** Make a temporary directory */
const mktemp = promisify(dir);

const handbrakeCli = 'HandBrakeCLI';

type ProgressBase = { message: string };

type ProgressWithPercent = ProgressBase & {
  percent: number
}

type ProgressWithEta = ProgressBase & ProgressWithPercent & {
  fps: {
    current: number
    average: number
  }
  eta: {
    hours: number
    minutes: number
    seconds: number
  }
}

export type ProgressEvent = ProgressBase | ProgressWithEta | ProgressWithPercent;

export async function handbrake(
  input: string,
  output: string,
  preset: {
    file: string,
    name: string,
  },
  threads: number,
  abort: AbortSignal,
  onProgress: (progress: ProgressEvent) => void,
) {
  // Handbrake delimits its progress messages using `\r`, which `execa` cannot progressively iterate
  // over. As such, we need to put the data into temporary files, which we then tail. This is
  // incredibly hacky, but I was able to write it faster than the following github issues were
  // resolved:
  // * https://github.com/sindresorhus/execa/issues/1210
  // * https://github.com/sindresorhus/execa/issues/1211
  const outputs = await mktemp();
  const stdout = path.join(outputs, 'stdout');
  const stderr = path.join(outputs, 'stderr');

  // Touch file so that tail doesn't fail if file doesn't exist yet
  await Bun.file(stdout).write('');

  const process = execa({
    stdout: { file: stdout },
    stderr: { file: stderr },
    cancelSignal: abort,
  })`${handbrakeCli}
    -x threads=${threads}
    --input ${input}
    --output ${output}
    --preset-import-file ${preset.file}
    -Z ${preset.name}`;

  const progress = new Tail(stdout, { separator: /\r/ });

  progress.on("line", line => {
    onProgress(parseProgress(line));
  });

  await process;

  progress.unwatch();
}

function parseProgress(line: string): ProgressEvent {
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
      }
    }
  } else {
    return { message: line };
  }
}
