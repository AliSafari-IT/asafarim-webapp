import React, { lazy, Suspense } from 'react';

const LazyTopMenu = lazy(() => import('./TopMenu'));

const TopMenu = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyTopMenu leftItems={[]} rightItems={[]} {...props} />
  </Suspense>
);

export default TopMenu;
