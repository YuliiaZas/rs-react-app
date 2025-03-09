import { HomePageDetails } from '@home-components';
import { peopleService } from '@services';
import { getStringifiedFilteredSearchParams } from '@utils';

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { id } = await params;
  const searchParamsStringified = getStringifiedFilteredSearchParams(
    await searchParams
  );
  const itemData = await peopleService.getItem(id);

  return (
    <HomePageDetails
      itemData={itemData}
      searchParams={searchParamsStringified}
    ></HomePageDetails>
  );
}
