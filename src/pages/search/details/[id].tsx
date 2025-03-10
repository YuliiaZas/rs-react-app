import { useNavigation } from 'react-router';
import { HomePageDetails } from '@home-components';
import { peopleService } from '@services';
import { getStringifiedFilteredSearchParams, PATH_VALUE } from '@utils';
import type { Route } from './+types/search';

export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.id) return null;
  return {
    data: await peopleService.getItem(params.id),
    searchParams: getStringifiedFilteredSearchParams(
      new URL(request.url).searchParams
    ),
  };
}

export default function ItemPage({ loaderData }: Route.ComponentProps) {
  const { searchParams, data } = loaderData ?? {};
  const navigation = useNavigation();
  const isNavigatingToDetails =
    navigation.location && navigation.location.pathname !== PATH_VALUE.HOME;

  return (
    <HomePageDetails
      itemData={data}
      searchParams={searchParams}
      isLoading={isNavigatingToDetails}
    ></HomePageDetails>
  );
}
