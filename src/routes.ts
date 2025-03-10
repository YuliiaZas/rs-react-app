import { layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/', 'pages/home.tsx'),
  layout('pages/search/home-page.layout.tsx', [
    route(`/search/:id`, 'pages/search/details/[id].tsx'),
    route('search', 'pages/search/details/null.tsx'),
  ]),
  route('/404', 'pages/404.tsx'),
  route('*?', 'pages/catchall.tsx'),
] satisfies RouteConfig;
