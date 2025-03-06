import { AppProps } from 'next/app';
import Head from 'next/head';
import { GlobalLayout } from '@layout';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>People of Star Wars</title>
      </Head>
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}
