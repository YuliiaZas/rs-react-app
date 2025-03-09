import { HomePageItems } from '@home-components';
import { peopleService } from '@services';
import { getFilteredParams } from '@utils';

export default async function ItemsPageCommon({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const itemsData = await peopleService.getItems(
    getFilteredParams(searchParams)
  );

  return <HomePageItems itemsData={itemsData} />;
}
