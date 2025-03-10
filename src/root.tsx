import { GlobalLayout } from '@layout';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>People of Star Wars</title>
        <link
          type="image/png"
          sizes="32x32"
          rel="icon"
          href="icon/icons8-lightsaber-32.png"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalLayout>{children}</GlobalLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
