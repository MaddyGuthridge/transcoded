import { error } from '@sveltejs/kit';
import * as z from 'zod';

export function zodParse<T>(schema: z.ZodType<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      error(400, e.message);
    } else {
      console.log(e);
      error(500, `${e}`);
    }
  }
}
