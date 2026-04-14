import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from './pages/index';
import BrowsePage from './pages/browse';
import RegisterPage from './pages/register';
import RajuPage from './pages/raju-chai-stall';
import PriyaPage from './pages/priya-sabziwali';
import AllVendorsPage from './pages/all-vendors';
import VendorProfilePage from './pages/vendor-profile';
import GuidePage from './pages/guide';

const NotFoundPage = lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/browse', element: <BrowsePage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/guide', element: <GuidePage /> },
  { path: '/raju-chai-stall', element: <RajuPage /> },
  { path: '/priya-sabziwali', element: <PriyaPage /> },
  { path: '/all-vendors', element: <AllVendorsPage /> },
  { path: '/vendor/:id', element: <VendorProfilePage /> },
  { path: '/vendor-profile', element: <VendorProfilePage /> },
  { path: '*', element: <Suspense fallback={null}><NotFoundPage /></Suspense> },
];

export type Path =
  | '/'
  | '/browse'
  | '/register'
  | '/raju-chai-stall'
  | '/priya-sabziwali'
  | '/all-vendors';
export type Params = Record<string, string | undefined>;
