import { HomePageDetails } from '@home-components';
import { PATH_VALUE } from '@utils';
import { useNavigation } from 'react-router';

export default function HomePageDrawer() {
  const navigation = useNavigation();
  const isNavigatingToDetails =
    navigation.location && navigation.location.pathname !== PATH_VALUE.HOME;

  if (isNavigatingToDetails) {
    return <HomePageDetails isLoading={true} />;
  }
  return null;
}
