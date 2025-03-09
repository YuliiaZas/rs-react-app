import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockItems, mockItemsFormattedFull } from '@mock';
import { text } from '@utils';
import { HomePageDetails } from './home-page-details';

vi.mock('./home-page-details.module.css', () => ({
  default: {
    card: 'card',
  },
}));

vi.mock('@lib', () => ({
  ErrorComponent: ({ errorMessageInfo }: { errorMessageInfo: string }) => (
    <div>{errorMessageInfo || text.errorComponent.errorMessage}</div>
  ),
  Spinner: () => <div role="status">Loading...</div>,
}));

const mockCloseFn = vi.fn();

const mockItem = mockItemsFormattedFull[0];
const mockItemRaw = mockItems[0];

describe('HomePageDetails', () => {
  it('should render spinner while data loading', () => {
    const { getByRole } = render(
      <HomePageDetails
        closeFn={mockCloseFn}
        itemData={{ data: mockItem }}
        isLoading={true}
      />
    );

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('should render formatted details when item is valid', () => {
    const { getByText } = render(
      <HomePageDetails
        closeFn={mockCloseFn}
        itemData={{ data: mockItem }}
        isLoading={false}
      />
    );

    expect(getByText(mockItem.name)).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Height: ${mockItemRaw.height}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Mass: ${mockItemRaw.mass}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Eye color: ${mockItemRaw.eye_color}`
      )
    ).toBeInTheDocument();
  });

  it('should render error component when item has type PeopleUnknown', () => {
    const { getByText } = render(
      <HomePageDetails
        closeFn={mockCloseFn}
        itemData={{ data: null }}
        isLoading={false}
      />
    );

    expect(getByText(text.homePage.emptyDetails)).toBeInTheDocument();
  });

  it('should render error component when data loading fails', () => {
    const { getByText } = render(
      <HomePageDetails
        closeFn={mockCloseFn}
        itemData={{ error: new Error('error') }}
        isLoading={false}
      />
    );

    expect(getByText(text.errorComponent.errorMessage)).toBeInTheDocument();
  });

  it('should call closeFn when close button is clicked', () => {
    const { getByLabelText } = render(
      <HomePageDetails
        closeFn={mockCloseFn}
        itemData={{ data: mockItem }}
        isLoading={false}
      />
    );

    fireEvent.click(getByLabelText('Close'));

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
