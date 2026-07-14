import { z } from 'zod';

z.setErrorMap((issue) => {
  console.log('ISSUE:', JSON.stringify(issue, null, 2));
  return { message: 'test' };
});

try {
  z.object({ name: z.string() }).parse({});
} catch (e) {
  // ignore
}
