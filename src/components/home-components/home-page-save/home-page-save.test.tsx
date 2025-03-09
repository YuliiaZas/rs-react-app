import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockItemsFormatted, mockItemsIds } from '@mock';
import { text } from '@utils';
import { selectItem, store, unselectAll, unselectItem } from '@store';
import { HomePageSave } from './home-page-save';

vi.mock('@store', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    dispatch: vi.fn(),
  };
});

window.URL.createObjectURL = vi.fn(() => 'mocked-url');

describe('HomePageSave', () => {
  it('should render correctly when there are selected items', () => {
    store.dispatch(
      selectItem({ item: mockItemsFormatted[0], id: mockItemsIds[0] })
    );
    store.dispatch(
      selectItem({ item: mockItemsFormatted[1], id: mockItemsIds[1] })
    );
    const { getByText } = render(
      <Provider store={store}>
        <HomePageSave />
      </Provider>
    );
    expect(
      getByText((content) => content.includes(`2 ${text.save.selectedItems}`))
    ).toBeInTheDocument();
    expect(getByText(text.save.unselect)).toBeInTheDocument();
    expect(getByText(text.save.download)).toBeInTheDocument();
  });

  it('should render correctly when there is a selected item', () => {
    store.dispatch(unselectItem({ id: mockItemsIds[0] }));
    const { getByText } = render(
      <Provider store={store}>
        <HomePageSave />
      </Provider>
    );
    expect(
      getByText((content) => content.includes(`1 ${text.save.selectedItems}`))
    ).toBeInTheDocument();
    expect(getByText(text.save.unselect)).toBeInTheDocument();
    expect(getByText(text.save.download)).toBeInTheDocument();
  });

  it('should dispatch unselectAll action on unselect button click', () => {
    vi.spyOn(store, 'dispatch');
    const { getByText } = render(
      <Provider store={store}>
        <HomePageSave />
      </Provider>
    );
    fireEvent.click(getByText(text.save.unselect));

    expect(store.dispatch).toHaveBeenCalledWith(unselectAll());
  });

  it('should not render when there are no selected items', () => {
    const { container } = render(
      <Provider store={store}>
        <HomePageSave />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle saving', () => {
    store.dispatch(
      selectItem({ item: mockItemsFormatted[0], id: mockItemsIds[0] })
    );
    const { getByText, getByRole } = render(
      <Provider store={store}>
        <HomePageSave />
      </Provider>
    );
    const downloadLink = getByRole('link', { hidden: true });

    fireEvent.click(getByText(text.save.download));

    expect(downloadLink).toHaveAttribute('href');
    expect(downloadLink).toHaveAttribute('download', `1${text.save.fileName}`);
  });
});
