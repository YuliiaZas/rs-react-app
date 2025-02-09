import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Search } from './search';

describe('Search', () => {
  const initialSearchValue = 'initial value';
  const placeholder = 'Search here';
  const updateSearchValue = vi.fn();

  it('should render with initial search value', () => {
    const { getByDisplayValue } = render(
      <Search
        initialSearchValue={initialSearchValue}
        updateSearchValue={updateSearchValue}
      />
    );
    expect(getByDisplayValue(initialSearchValue)).toBeInTheDocument();
  });

  it('should update input value on change', () => {
    const { getByPlaceholderText } = render(
      <Search
        initialSearchValue={initialSearchValue}
        placeholder={placeholder}
        updateSearchValue={updateSearchValue}
      />
    );
    const input = getByPlaceholderText(placeholder);
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveValue('new value');
  });

  it('should call updateSearchValue on button click', () => {
    const { getByText } = render(
      <Search
        initialSearchValue={initialSearchValue}
        updateSearchValue={updateSearchValue}
      />
    );
    fireEvent.click(getByText('Search'));
    expect(updateSearchValue).toHaveBeenCalledWith(initialSearchValue);
  });

  it('should call updateSearchValue on Enter key press', () => {
    const { getByDisplayValue } = render(
      <Search
        initialSearchValue={initialSearchValue}
        updateSearchValue={updateSearchValue}
      />
    );
    const input = getByDisplayValue(initialSearchValue);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(updateSearchValue).toHaveBeenCalledWith(initialSearchValue);
  });
});
