import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { GetServerSidePropsContext } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { mockFetchItemsResult, mockItemsFormattedFull } from '@mock';
import { store } from '@store';
import HomePage, { getServerSideProps, HomePageProps } from './[[...slug]]';

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

vi.mock('@services', () => ({
  peopleService: {
    getItems: () => Promise.resolve({ data: mockFetchItemsResult }),
    getItem: () => Promise.resolve({ data: mockItemsFormattedFull[0] }),
  },
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

describe('HomePage', () => {
  it('should render details', async () => {
    const context = { query: { slug: ['1'] } };
    const { props } = (await getServerSideProps(
      context as unknown as GetServerSidePropsContext
    )) as { props: HomePageProps };
    const { getByText } = render(
      <Provider store={store}>
        <HomePage {...props} />
      </Provider>
    );

    expect(getByText(mockHomePageDetailsComponentText)).toBeInTheDocument();
  });

  it('should not render details', async () => {
    const context = { query: { page: '1' } };
    const { props } = (await getServerSideProps(
      context as unknown as GetServerSidePropsContext
    )) as { props: HomePageProps };
    const { queryByText } = render(
      <Provider store={store}>
        <HomePage {...props} />
      </Provider>
    );

    expect(
      queryByText(mockHomePageDetailsComponentText)
    ).not.toBeInTheDocument();
  });
});
