import { LoaderFunctionArgs } from 'react-router-dom';
import { peopleService } from '@services';
import { People, PeopleUnknown } from '@utils';

export type DetailsLoaderData = People | PeopleUnknown;

export const detailsLoader = async ({
  params,
}: LoaderFunctionArgs<{ item: Promise<DetailsLoaderData> }>) =>
  ({
    item: peopleService.getItem(params.searchId),
  }) as { item: Promise<DetailsLoaderData> };
