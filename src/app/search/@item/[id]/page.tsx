import { HomePageDetails } from '@home-components';
import { Spinner } from '@lib';
import { peopleService } from '@services';
import { getStringifiedFilteredSearchParams } from '@utils';
import { Suspense } from 'react';
// import { FetchResponce, getIdFromUrl, PeopleFormatted } from '@utils';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

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
  // console.log(query);
  // const [id, setId] = useState<string>('');
  // const router = useRouter();

  // useEffect(() => {
  //   params.then(({ id }) => {
  //     setId(id);
  //     console.log('slug', id, params);
  //   });
  // }, [params]);

  // const [itemData, setItemData] = useState<
  //   FetchResponce<PeopleFormatted | null>
  // >({ data: null });

  // const [isItemLoading, setItemLoading] = useState(false);
  // const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  // useEffect(() => {
  //   setItemLoading(false);
  // }, [itemData]);

  // useEffect(() => {
  //   if (!router) return;

  //   const handleRouteChangeStart = (url: string) => {
  //     const isRedirectToDetails = !!getIdFromUrl(url);
  //     setIsDetailsVisible(isRedirectToDetails);
  //     if (isRedirectToDetails) {
  //       setItemLoading(true);
  //     }
  //   };

  //   router.events.on('routeChangeStart', handleRouteChangeStart);

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChangeStart);
  //   };
  // }, [router]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await peopleService.getItem(id);
  //     setItemData(data);
  //   }
  //   fetchData();
  // }, [id]);
  const itemData = await peopleService.getItem(id);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <HomePageDetails
          itemData={itemData}
          searchParams={searchParamsStringified}
          // isLoading={false}
          // isLoading={isItemLoading}
          // closeFn={() => {}}
          // closeFn={closeOutlet}
        ></HomePageDetails>
      </Suspense>
    </>
  );
  // return (
  //   <>
  //     {id && (
  //       <HomePageDetails
  //         itemData={itemData}
  //         searchParams={searchParamsStringified}
  //         isLoading={false}
  //         // isLoading={isItemLoading}
  //         // closeFn={() => {}}
  //         // closeFn={closeOutlet}
  //       ></HomePageDetails>
  //     )}
  //   </>
  // );
}
