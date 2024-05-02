import { vi } from 'vitest';

import { RunnableVersion } from '../../src/interfaces';

export class BisectorMock {
  public revList: Array<RunnableVersion>;
  public minRev: number;
  public maxRev: number;
  public pivot: number;

  public getCurrentVersion = vi.fn();
  public continue = vi.fn();
  public calculatePivot = vi.fn();
}
