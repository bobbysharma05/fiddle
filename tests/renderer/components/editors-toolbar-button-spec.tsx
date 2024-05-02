import * as React from 'react';

import { shallow } from 'enzyme';
import { vi } from 'vitest';

import { EditorId, MAIN_JS } from '../../../src/interfaces';
import {
  MaximizeButton,
  RemoveButton,
} from '../../../src/renderer/components/editors-toolbar-button';
import { AppState } from '../../../src/renderer/state';

let mockContext: any = {};

vi.mock('react-mosaic-component', async () => {
  const { MosaicContext, MosaicWindowContext } = await vi.importActual<
    typeof import('react-mosaic-component')
  >('react-mosaic-component');

  (MosaicContext.Consumer as any) = (props: any) => props.children(mockContext);

  return {
    MosaicContext,
    MosaicWindowContext,
  };
});

describe('Editor toolbar button component', () => {
  let store: AppState;

  beforeAll(() => {
    mockContext = {
      mosaicWindowActions: {
        getPath: vi.fn(),
        split: vi.fn(),
        replaceWithNew: vi.fn(),
        setAdditionalControlsOpen: vi.fn(),
        connectDragSource: vi.fn(),
      },
      mosaicActions: {
        expand: vi.fn(),
        remove: vi.fn(),
        hide: vi.fn(),
        replaceWith: vi.fn(),
        updateTree: vi.fn(),
        getRoot: vi.fn(),
      },
      mosaicId: 'test',
    };

    ({ state: store } = window.app);
  });

  describe('MaximizeButton', () => {
    function createMaximizeButton(id: EditorId) {
      const wrapper = shallow(<MaximizeButton id={id} appState={store} />, {
        context: mockContext,
      });
      const instance = wrapper.instance();
      return { instance, wrapper };
    }

    it('renders', () => {
      const { wrapper } = createMaximizeButton(MAIN_JS);
      expect(wrapper).toMatchSnapshot();
    });

    it('handles a click', () => {
      const { instance, wrapper } = createMaximizeButton(MAIN_JS);
      instance.context = mockContext as unknown;
      wrapper.dive().dive().find('button').simulate('click');
      expect(mockContext.mosaicActions.expand).toHaveBeenCalledTimes(1);
    });
  });

  describe('RemoveButton', () => {
    function createRemoveButton(id: EditorId) {
      const wrapper = shallow(<RemoveButton id={id} appState={store} />, {
        context: mockContext,
      });
      return { wrapper };
    }

    it('renders', () => {
      const { wrapper } = createRemoveButton(MAIN_JS);
      expect(wrapper).toMatchSnapshot();
    });

    it('handles a click', () => {
      const { editorMosaic } = store;
      const hideSpy = vi.spyOn(editorMosaic, 'hide');
      const { wrapper } = createRemoveButton(MAIN_JS);
      wrapper.dive().dive().find('button').simulate('click');
      expect(hideSpy).toHaveBeenCalledTimes(1);
    });
  });
});
