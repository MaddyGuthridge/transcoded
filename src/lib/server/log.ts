const log: string[] = [];

type LogListener = (message: string) => any;

const listeners: LogListener[] = [];

export function write(message: string) {
  log.push(message);
  for (const listener of listeners) {
    listener(message);
  }
}

export function registerListener(onLog: LogListener) {
  listeners.push(onLog);
}

registerListener(console.log);
