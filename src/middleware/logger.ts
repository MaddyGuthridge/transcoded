import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import chalk, { type ChalkInstance } from 'chalk';
import Spinnies from 'spinnies';

let spinners: Spinnies | undefined;

let requestCount = 0;

/** Colorize request method for pretty-printing */
function colorRequestMethod(method: string): string {
  const mapping: Record<string, ChalkInstance> = {
    get: chalk.blue,
    post: chalk.green,
    put: chalk.yellow,
    delete: chalk.red,
  };

  return mapping[method.toLowerCase()](method) ?? method;
}

/** Format time to handle request, given a start time */
function formatDuration(start: number, end: number) {
  const duration = end - start;
  let color: ChalkInstance;
  if (duration < 10) {
    color = chalk.gray;
  } else if (duration < 50) {
    color = chalk.white;
  } else if (duration < 100) {
    color = chalk.green;
  } else if (duration < 500) {
    color = chalk.blue;
  } else if (duration < 1000) {
    color = chalk.yellow;
  } else {
    color = chalk.red;
  }

  return color(`(${duration}ms)`);
}

/** Colorize status code */
function colorStatus(code: number): string {
  if (code < 300) {
    return chalk.green(code);
  } else if (code < 400) {
    return chalk.blue(code);
  } else if (code < 500) {
    return chalk.yellow(code);
  } else {
    return chalk.red(code);
  }
}

function formatPartialRequest(startTime: number, method: string, path: string): string {
  return [
    chalk.gray(new Date(startTime).toISOString()),
    colorRequestMethod(method),
    chalk.magenta(path),
  ].join(' ');
}

function formatCompletedRequest(startTime: number, method: string, path: string, status: number): string {
  return [
    chalk.gray(new Date(startTime).toISOString()),
    colorRequestMethod(method),
    chalk.magenta(path),
    formatDuration(startTime, Date.now()),
    colorStatus(status),
  ].join(' ');
}

/**
 * Logging middleware to display incoming requests
 *
 * Shows in the format:
 *
 *     2022-10-01T14:48:00.000Z GET / (23ms) 200
 *
 * Adapted from: https://www.reddit.com/r/sveltejs/comments/xtbkpb
 */
export const devLogger: Handle = async (req) => {
  // Only use spinners if connected to a tty to avoid creating a needlessly
  // long log file
  const isTty = process.stdout.isTTY;
  spinners ??= new Spinnies();

  const requestId = `${requestCount++}`;
  const requestStartTime = Date.now();

  if (isTty) {
    spinners.add(requestId, {
      text: formatPartialRequest(requestStartTime, req.event.request.method, req.event.url.pathname),
    });
  }

  const response = await req.resolve(req.event);

  const responseString = formatCompletedRequest(requestStartTime, req.event.request.method, req.event.url.pathname, response.status);

  if (isTty) {
    if (response.status < 500) {
      spinners.succeed(requestId, { text: responseString });
    } else {
      spinners.fail(requestId, { text: responseString });
    }
  } else {
    console.log(responseString);
  }
  return response;
};

export const productionLogger: Handle = async (req) => {
  const requestStartTime = Date.now();
  const response = await req.resolve(req.event);
  const responseString = [
    new Date(requestStartTime).toISOString(),
    req.event.request.method,
    `${req.event.url.pathname}:`,
    response.status,
    `(${Date.now() - requestStartTime} ms)`,
  ].join(' ');
  console.log(responseString);
  return response;
};

export default function logger() {
  return dev ? devLogger : productionLogger;
}
