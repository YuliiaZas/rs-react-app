import { redirect } from 'react-router';

export async function loader() {
  return redirect('/404');
}

export default function CatchAll() {
  return null;
}
