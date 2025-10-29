import { parseProgress, splitByDelimiter } from '$lib/server/handbrakeWrapper';
import { test, expect, describe } from 'bun:test';
import { Readable } from 'node:stream';

test.concurrent('splitByDelimiter', async () => {
  const s = new Readable();
  // https://stackoverflow.com/a/22085851/6335363
  s._read = () => {};
  s.push('Line 1\rLine 2\rLine 3');
  // Close stream
  s.push(null);

  const result = await Array.fromAsync(splitByDelimiter(s, '\r'));
  expect(result).toStrictEqual(['Line 1', 'Line 2', 'Line 3']);
});

describe('parseProgress', () => {
  test('Unrecognised message', () => {
    expect(parseProgress('Muxing... this may take a while'))
      .toStrictEqual({ message: 'Muxing... this may take a while' });
  });

  test.concurrent('Encoding simple', () => {
    expect(parseProgress('Encoding: task 1 of 1, 0.16 %'))
      .toStrictEqual({
        message: 'Encoding: task 1 of 1, 0.16 %',
        percent: 0.16,
      });
  });

  test.concurrent('Encoding full', () => {
    expect(parseProgress('Encoding: task 1 of 1, 0.17 % (35.56 fps, avg 49.69 fps, ETA 00h42m25s)'))
      .toStrictEqual({
        message: 'Encoding: task 1 of 1, 0.17 % (35.56 fps, avg 49.69 fps, ETA 00h42m25s)',
        percent: 0.17,
        fps: {
          current: 35.56,
          average: 49.69,
        },
        eta: {
          hours: 0,
          minutes: 42,
          seconds: 25,
        },
      });
  });
});
