import { mount } from 'enzyme';
import { vi } from 'vitest';

import { renderNonIdealState } from '../../../src/renderer/components/editors-non-ideal-state';
import { EditorMosaic } from '../../../src/renderer/editor-mosaic';

describe('renderNonIdealState()', () => {
  let editorMosaic: EditorMosaic;

  beforeEach(() => {
    ({ editorMosaic } = window.app.state);
  });

  it('renders a non-ideal state', () => {
    expect(renderNonIdealState({} as EditorMosaic)).toMatchSnapshot();
  });

  it('handles a click', () => {
    const resetLayoutSpy = vi.spyOn(editorMosaic, 'resetLayout');
    const wrapper = mount(renderNonIdealState(editorMosaic));
    wrapper.find('button').simulate('click');
    expect(resetLayoutSpy).toHaveBeenCalledTimes(1);
  });
});
