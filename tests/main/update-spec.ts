/**
 * @vitest-environment node
 */
import { vi } from 'vitest';

vi.useFakeTimers();
vi.spyOn(global, 'setTimeout');

const mockUpdateApp = vi.fn();
vi.mock('update-electron-app', () => ({ default: mockUpdateApp }));

describe('update', async () => {
  const { setupUpdates } = await import('../../src/main/update');

  it.skip('schedules an update check', () => {
    setupUpdates();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    vi.mocked(setTimeout).mock.calls[0][0]();
    expect(mockUpdateApp).toHaveBeenCalled();
  });
});
