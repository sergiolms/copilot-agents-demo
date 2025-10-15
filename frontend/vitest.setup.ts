import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// @ts-ignore - matcher types augment expect
expect.extend(matchers);
