import { Provider } from 'react-redux';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockSearchValue } from '@mock';
import { store } from '@store';
import { CurrentSearchParams, text } from '@utils';
import { HomePageSearch } from './home-page-search';

let mockParams: CurrentSearchParams = {
  search: mockSearchValue,
};

vi.mock('@context', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useHomeSearch: () => [
      { search: mockSearchValue } as CurrentSearchParams,
      (value: CurrentSearchParams) => {
        mockParams = value;
      },
    ],
  };
});

vi.mock('@lib', () => ({
  Search: ({
    initialSearchValue,
    updateSearchValue,
    placeholder,
  }: {
    initialSearchValue: string;
    updateSearchValue: (value: string) => void;
    placeholder: string;
  }) => (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={initialSearchValue}
      onChange={(e) => updateSearchValue(e.target.value)}
    />
  ),
}));

describe('HomePageSearch', () => {
  it('should not update search params on space add to input value', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <HomePageSearch />
      </Provider>
    );

    const searchInput = getByPlaceholderText(
      text.homePage.searchPlaceholder
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(searchInput, {
        target: { value: mockSearchValue + ' ' },
      });
    });

    expect(mockParams.search).toBe(mockSearchValue);
  });

  it('should update search params on input value changes', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <HomePageSearch />
      </Provider>
    );

    const searchInput = getByPlaceholderText(
      text.homePage.searchPlaceholder
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(searchInput, {
        target: { value: '' },
      });
    });

    expect(mockParams.search).toBe('');
  });
});
