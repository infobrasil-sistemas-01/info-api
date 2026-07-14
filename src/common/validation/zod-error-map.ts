import { z } from 'zod';
import { pt } from 'zod/v4/locales';

export const portugueseErrorMap = pt().localeError;

z.setErrorMap(portugueseErrorMap);
