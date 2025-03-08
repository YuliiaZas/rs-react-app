import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import createMockRouter from 'next-router-mock';
import { HomePageDetails, HomePageItems } from '@home-components';
import { mockFetchItemsResult } from '@mock';
import { store } from '@store';
import HomePage from './layout';

vi.mock('./home-page.module.css', () => ({
  default: {
    'home-wrapper': 'home-wrapper',
    'home-main': 'home-wrapper',
    'home-search': 'home-search',
    'home-details': 'home-details',
    'home-content': 'home-content',
    'home-content-title': 'home-content-title',
    'home-content-wrapper ': 'home-content-wrapper ',
    'home-error': 'home-error',
    'home-error-button': 'home-error-button',
  },
}));

const mockHomePageItemsComponentText = 'Mocked Home Page Items';
const mockHomePageDetailsComponentText = 'Mocked Home Page Details';
const mockHomePageSaveComponentText = 'Mocked Home Page Save';
const mockHomePageSearchComponentText = 'Mocked Home Page Search';

vi.mock('@home-components', () => ({
  HomePageItems: () => <div>{mockHomePageItemsComponentText}</div>,
  HomePageDetails: () => <div>{mockHomePageDetailsComponentText}</div>,
  HomePageSave: () => <div>{mockHomePageSaveComponentText}</div>,
  HomePageSearch: () => <div>{mockHomePageSearchComponentText}</div>,
}));

vi.mock('@lib', () => ({
  Spinner: () => <div role="status">Loading...</div>,
}));

vi.mock('@store', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    getState: vi.fn(),
  };
});

const mockRouter = createMockRouter;
mockRouter.push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouter.push,
  }),
  usePathname: () => '',
  useSearchParams: () => '',
}));

describe('HomePage', () => {
  it('should render items list and details', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomePage
          items={<HomePageItems itemsData={{ data: mockFetchItemsResult }} />}
          item={<HomePageDetails />}
        />
      </Provider>
    );

    expect(getByText(mockHomePageItemsComponentText)).toBeInTheDocument();
    expect(getByText(mockHomePageDetailsComponentText)).toBeInTheDocument();
  });
});
