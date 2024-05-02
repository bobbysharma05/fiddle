/**
 * @vitest-environment node
 */

import { vi } from 'vitest';

import { shouldQuit } from '../../src/main/squirrel';

vi.mock('electron-squirrel-startup', () => ({ mock: true }));

describe('shouldQuit', () => {
  it.skip('returns simply electron-squirrel-startup', () => {
    expect(shouldQuit()).toEqual({ mock: true });
  });
});
