export function* enumerate<T>(arr: T[]): Generator<[number, T]> {
  for (let i = 0; i < arr.length; i++) {
    yield [i, arr[i]];
  }
}

export function todo(feature: string | undefined = undefined): never {
  throw new Error(`Feature ${feature ? `'${feature}' ` : ''}has not been implemented yet.`);
}
