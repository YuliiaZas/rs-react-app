import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { getFilteredParams } from '@utils';

export default function ScrollLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isRedirectToNewPage, setIsRedirectToNewPage] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const getStringifiedParams = (
    params: URLSearchParams | ParsedUrlQuery
  ): string => {
    return new URLSearchParams(getFilteredParams(params)).toString();
  };

  useEffect(() => {
    let controller: AbortController = new AbortController();

    const getIsRedirectToNewPage = (url: string): boolean => {
      const currentSearchParams = getStringifiedParams(router.query);
      const newSearchParams = getStringifiedParams(
        new URLSearchParams(url.split('?')[1] || '')
      );
      return currentSearchParams !== newSearchParams;
    };

    const handleScroll = () => {
      if (!isFirstRender && !controller.signal.aborted) {
        setScrollPosition(window.scrollY);
      }
    };

    const handleRouteChangeStart = (url: string) => {
      controller = new AbortController();
      if (isFirstRender) setIsFirstRender(false);

      setIsRedirectToNewPage(getIsRedirectToNewPage(url));

      setScrollPosition(window.scrollY);
    };

    const handleRouteChangeComplete = () => {
      controller.abort();
      window.scrollTo(0, isRedirectToNewPage ? 0 : scrollPosition);
    };

    window.addEventListener('scroll', handleScroll, {
      signal: controller.signal,
    });
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      window.removeEventListener('scroll', handleScroll);
      controller.abort();
    };
  }, [
    isFirstRender,
    isRedirectToNewPage,
    router.events,
    router.query,
    scrollPosition,
  ]);
  return <div style={{ width: '100%' }}>{children}</div>;
}
