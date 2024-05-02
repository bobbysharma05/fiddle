import { exec as cpExec } from 'node:child_process';

import { vi } from 'vitest';

import { overridePlatform, resetPlatform } from '../../utils';

vi.mock('node:child_process');

const mockShellEnv = vi.fn();
vi.mock('shell-env', () => ({ default: mockShellEnv }));

describe('exec', async () => {
  // Allow us to reset the module between each run
  let execModule = await import('../../../src/main/utils/exec');

  beforeEach(async () => {
    vi.resetModules();
    execModule = await import('../../../src/main/utils/exec');
    mockShellEnv.mockResolvedValue({ PATH: '/some/path' });
  });

  afterEach(() => {
    resetPlatform();
  });

  describe('exec()', () => {
    it.skip('executes a given string', async () => {
      vi.mocked(cpExec).mockImplementation((_a: any, _b: any, c: any) =>
        c(null, {
          stdout: 'hi',
          stderr: '',
        }),
      );

      const result = await execModule.exec('a/dir', 'echo hi');

      expect(cpExec).toBeCalledWith(
        'echo hi',
        {
          cwd: 'a/dir',
          maxBuffer: 20480000,
        },
        expect.anything(),
      );
      expect(result).toBe('hi');
    });

    it.skip('handles a returned string', async () => {
      vi.mocked(cpExec).mockImplementation((_a: any, _b: any, c: any) =>
        c(null, {
          stdout: 'hi',
          stderr: '',
        }),
      );

      const result = await execModule.exec('a/dir', 'echo hi');
      expect(result).toBe('hi');
    });

    it('handles errors', async () => {
      let errored = false;
      vi.mocked(cpExec).mockImplementation((_a: any, _b: any, c: any) =>
        c(new Error('Poop!')),
      );

      try {
        await execModule.exec('a/dir', 'echo hi');
      } catch (error) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('maybeFixPath()', () => {
    it('does not do anything on Windows', async () => {
      overridePlatform('win32');

      await execModule.maybeFixPath();

      expect(mockShellEnv).toHaveBeenCalledTimes(0);
    });

    it('calls shell-env on macOS', async () => {
      overridePlatform('darwin');

      await execModule.maybeFixPath();

      expect(mockShellEnv).toHaveBeenCalledTimes(1);
    });

    it('calls shell-env on Linux', async () => {
      overridePlatform('linux');

      await execModule.maybeFixPath();

      expect(mockShellEnv).toHaveBeenCalledTimes(1);
    });
  });
});
