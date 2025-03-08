import { Suspense } from 'react';
import { HomePageItems } from '@home-components';
import { Spinner } from '@lib';
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

  return (
    <Suspense fallback={<Spinner />}>
      <HomePageItems itemsData={itemsData} />
    </Suspense>
  );
}
