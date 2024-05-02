import { configure as enzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import { configure as mobxConfigure } from 'mobx';
import { vi } from 'vitest';

import { AppMock, ElectronFiddleMock, MonacoMock } from './mocks/mocks';

enzymeConfigure({ adapter: new Adapter() });

// allow vitest fns to overwrite readonly mobx stuff
// https://mobx.js.org/configuration.html#safedescriptors-boolean
mobxConfigure({ safeDescriptors: false });
require('@testing-library/jest-dom/extend-expect');

global.confirm = vi.fn();

if (!process.env.FIDDLE_VERBOSE_TESTS) {
  vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn());
  vi.spyOn(global.console, 'info').mockImplementation(() => vi.fn());
  vi.spyOn(global.console, 'log').mockImplementation(() => vi.fn());
  vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn());
  vi.spyOn(global.console, 'debug').mockImplementation(() => vi.fn());
}
vi.mock('electron', () => import('./mocks/electron'));
vi.mock('fs-extra');

// Disable Sentry in tests
vi.mock('@sentry/electron/main', () => ({
  init: vi.fn(),
}));
vi.mock('@sentry/electron/renderer', () => ({
  init: vi.fn(),
}));

class FakeBroadcastChannel extends EventTarget {
  public name: string;

  constructor(channelName: string) {
    super();
    this.name = channelName;
  }

  postMessage(message: unknown) {
    this.dispatchEvent(new MessageEvent('message', { data: message }));
  }
}

(global.BroadcastChannel as any) = class Singleton {
  static channels = new Map();

  constructor(channelName: string) {
    if (!Singleton.channels.has(channelName)) {
      Singleton.channels.set(
        channelName,
        new FakeBroadcastChannel(channelName),
      );
    }
    return Singleton.channels.get(channelName);
  }
};

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }) as any);

// We want to detect vi sometimes
(global as any).__vi__ = (global as any).__vi__ || {};

// Setup for main tests
global.window = global.window || {};
global.document = global.document || { body: {} };
global.fetch = window.fetch = vi.fn();

delete (window as any).localStorage;
(window.localStorage as any) = {};

window.navigator = window.navigator ?? {};
(window.navigator.clipboard as any) = {};

/**
 * Mock these properties twice so that they're available
 * both at the top-level of files and also within the
 * code called in individual tests.
 */
(window.ElectronFiddle as any) = new ElectronFiddleMock();
(window.app as any) = new AppMock();
(window.monaco as any) = new MonacoMock();
window.localStorage.setItem = vi.fn();
window.localStorage.getItem = vi.fn();
window.localStorage.removeItem = vi.fn();
window.open = vi.fn();
window.navigator.clipboard.readText = vi.fn();
window.navigator.clipboard.writeText = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();

  (process.env.vi as any) = true;
  (process.env.TEST as any) = true;
  document.body.innerHTML = '<div id="app" />';

  (window.ElectronFiddle as any) = new ElectronFiddleMock();
  (window.app as any) = new AppMock();
  (window.monaco as any) = new MonacoMock();
  vi.mocked(window.localStorage.setItem).mockReset();
  vi.mocked(window.localStorage.getItem).mockReset();
  vi.mocked(window.localStorage.removeItem).mockReset();
  vi.mocked(window.open).mockReset();
});
