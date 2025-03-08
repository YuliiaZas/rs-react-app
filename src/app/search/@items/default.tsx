import ItemsPageCommon from './common-page';

export default async function ItemsPageDefault({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <ItemsPageCommon searchParams={await searchParams} />;
}
