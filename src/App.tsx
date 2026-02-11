import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout';
import { Loader } from './components/common';
import Home from './pages/Home/Home';

// Lazy load pages
const CharacterDetail = lazy(
  () => import('./pages/CharacterDetail/CharacterDetail')
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
