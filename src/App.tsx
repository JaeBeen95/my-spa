/** @jsx createElement */
import { createElement } from './react';
// import { BrowserRouter, Routes } from './router';
// import { ArticleView } from './ui/view/ArticleView';
// import { ArticleDetailView } from './ui/view/ArticleDetailView';
import TestSuite from './ui/Counter';

export function App(): JSX.Element {
  return <TestSuite />;
  // <BrowserRouter>
  //   <Routes
  //     routes={[
  //       { path: '/', element: () => <ArticleView /> },
  //       { path: '/article/:id', element: () => <ArticleDetailView /> },
  //     ]}
  //   />
  // </BrowserRouter>
}
