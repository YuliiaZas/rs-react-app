import { GetServerSideProps } from 'next';
import { peopleService } from '@services';
import { getFilteredParams, isStringifiedNumberValid } from '@utils';
import HomeLayout, { HomePageProps } from '../../app/search/layout';

const isUrlValid = (slugs: string | string[]): boolean => {
  return (
    Array.isArray(slugs) &&
    (slugs.length === 0 ||
      (slugs.length === 1 && isStringifiedNumberValid(slugs[0])))
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const slugs = query.slug ?? [];
  if (!isUrlValid(slugs)) return { notFound: true };

  const props: HomePageProps = {
    items: await peopleService.getItems(getFilteredParams(query)),
  };

  const detailsId = slugs[0];
  if (!detailsId) return { props };

  return {
    props: {
      ...props,
      item: await peopleService.getItem(detailsId),
    },
  };
};

const HomePage = (props: HomePageProps) => {
  return <HomeLayout {...props} />;
};

export default HomePage;
