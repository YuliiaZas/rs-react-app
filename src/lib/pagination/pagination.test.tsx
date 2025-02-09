import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  const onClickMock = vi.fn();

  it('should render the correct number of pages', () => {
    const { getAllByRole } = render(
      <Pagination pagesNumber={5} onClick={onClickMock} />
    );
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('should call onClick with the correct page number', () => {
    const { getByText } = render(
      <Pagination pagesNumber={5} onClick={onClickMock} />
    );
    const button = getByText('3');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledWith('3');
  });

  it('should apply the active class to the current page', () => {
    const { getByText } = render(
      <Pagination pagesNumber={5} currentPage="3" onClick={onClickMock} />
    );
    const button = getByText('3');
    expect(button).toHaveClass('active');
  });

  it('should apply the active class to the first page if currentPage is not provided', () => {
    const { getByText } = render(
      <Pagination pagesNumber={5} onClick={onClickMock} />
    );
    const button = getByText('1');
    expect(button).toHaveClass('active');
  });
});
