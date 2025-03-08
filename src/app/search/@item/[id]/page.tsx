import { HomePageDetails } from '@home-components';
import { Spinner } from '@lib';
import { peopleService } from '@services';
import { getStringifiedFilteredSearchParams } from '@utils';
import { Suspense } from 'react';

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
    <>
      <Suspense fallback={<Spinner />}>
        <HomePageDetails
          itemData={itemData}
          searchParams={searchParamsStringified}
        ></HomePageDetails>
      </Suspense>
    </>
  );
}
