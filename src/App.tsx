import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout';
import { Loader } from './components/common';
import { FilterProvider } from './context/FilterContext';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';

// Lazy load pages
const CharacterDetail = lazy(
  () => import('./pages/CharacterDetail/CharacterDetail')
);

function RootLayout() {
  return (
    <Layout>
      <FilterProvider>
        {/* Handles lazy route loading via Outlet */}
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </FilterProvider>
    </Layout>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/character/:id',
        element: <CharacterDetail />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
