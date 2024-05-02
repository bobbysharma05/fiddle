import * as electron from 'electron';
import fs from 'fs-extra';
import { vi } from 'vitest';

import { isFirstRun } from '../../../src/main/utils/check-first-run';

vi.mock('fs-extra', () => ({
  default: {
    existsSync: vi.fn(),
    outputFileSync: vi.fn(),
  },
}));

describe('isFirstRun', () => {
  beforeEach(() => {
    vi.mocked(electron.app.getPath).mockReturnValue('path');
  });

  it('reports a non-first run', () => {
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    expect(isFirstRun()).toBe(false);
  });

  it('reports a first run', () => {
    vi.mocked(fs.existsSync).mockReturnValueOnce(false);
    expect(isFirstRun()).toBe(true);
    expect(fs.outputFileSync).toHaveBeenCalledTimes(1);
  });

  it('handles an error', () => {
    vi.mocked(fs.existsSync).mockImplementationOnce(() => {
      throw new Error('bwap bwap');
    });

    expect(isFirstRun()).toBe(true);
  });
});
