/**
 * @vitest-environment node
 */

import { vi } from 'vitest';

import { setupDevTools } from '../../src/main/devtools';
import { isDevMode } from '../../src/main/utils/devmode';

vi.mock('../../src/main/utils/devmode');

const installExtension = vi.fn();

vi.mock('electron-devtools-installer', () => ({
  default: installExtension,
  REACT_DEVELOPER_TOOLS: 'xREACT_DEVELOPER_TOOLS',
  REACT_PERF: 'REACT_PERF',
}));

describe.skip('devtools', () => {
  it('does not set up developer tools if not in dev mode', async () => {
    vi.mocked(isDevMode).mockReturnValue(false);
    setupDevTools();

    expect(installExtension).toHaveBeenCalledTimes(0);
  });

  it('sets up developer tools if in dev mode', async () => {
    vi.mocked(isDevMode).mockReturnValue(true);
    setupDevTools();

    expect(installExtension).toHaveBeenCalledTimes(1);
  });

  it('catch error in setting up developer tools', async () => {
    // throw devtool error
    vi.mocked(installExtension).mockRejectedValue(new Error('devtool error'));
    vi.mocked(isDevMode).mockReturnValue(true);

    let error: any;

    try {
      await setupDevTools();
    } catch (e) {
      error = e;
    }

    expect(error).toMatch('error');
  });
});
