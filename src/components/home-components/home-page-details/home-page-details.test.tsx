import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import createMockRouter from 'next-router-mock';
import { mockItems, mockItemsFormattedFull } from '@mock';
import { PATH_VALUE, text } from '@utils';
import { store } from '@store';
import { HomePageDetails } from './home-page-details';

const mockRouter = createMockRouter;
mockRouter.push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouter.push,
  }),
  usePathname: () => '',
}));

vi.mock('./home-page-details.module.css', () => ({
  default: {
    card: 'card',
  },
}));

vi.mock('@lib', () => ({
  ErrorComponent: ({ errorMessageInfo }: { errorMessageInfo: string }) => (
    <div>{errorMessageInfo || text.errorComponent.errorMessage}</div>
  ),
}));

const mockItem = mockItemsFormattedFull[0];
const mockItemRaw = mockItems[0];

describe('HomePageDetails', () => {
  it('should render formatted details when item is valid', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomePageDetails itemData={{ data: mockItem }} searchParams="" />
      </Provider>
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
      <Provider store={store}>
        <HomePageDetails itemData={{ data: null }} searchParams="" />
      </Provider>
    );

    expect(getByText(text.homePage.emptyDetails)).toBeInTheDocument();
  });

  it('should render error component when data loading fails', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomePageDetails
          itemData={{ error: new Error('error') }}
          searchParams=""
        />
      </Provider>
    );

    expect(getByText(text.errorComponent.errorMessage)).toBeInTheDocument();
  });

  it('should call closeFn when close button is clicked', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <HomePageDetails itemData={{ data: mockItem }} searchParams="" />
      </Provider>
    );

    fireEvent.click(getByLabelText('Close'));

    expect(mockRouter.push).toHaveBeenCalledWith(PATH_VALUE.HOME);
  });
});
