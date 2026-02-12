import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout';
import { Loader } from './components/common';
import { FilterProvider } from './context/FilterContext';
import Home from './pages/Home/Home';

// Lazy load pages
const CharacterDetail = lazy(
  () => import('./pages/CharacterDetail/CharacterDetail')
);

function RootLayout() {
  return (
    <Layout>
      <FilterProvider>
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
