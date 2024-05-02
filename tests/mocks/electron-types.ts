import { vi } from 'vitest';

export class ElectronTypesMock {
  public setVersion = vi.fn();
  public uncache = vi.fn();
}

export interface NodeTypesMock {
  path: string;
  type: string;
  contentType: string;
  integrity: string;
  lastModified: string;
  size: number;
  files?: NodeTypesMock[];
}
