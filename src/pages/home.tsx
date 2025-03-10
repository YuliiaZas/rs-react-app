import { PATH_VALUE } from '@utils';
import { redirect } from 'react-router';

export async function loader() {
  return redirect(PATH_VALUE.HOME);
}

export default function Home() {
  return null;
}
