/** @jsx createElement */
import { createElement } from './react';
import { RouteParams, Routes } from './router';
import { ArticleView } from './ui/view/ArticleView';
import { ArticleDetailView } from './ui/view/ArticleDetailView';

export function App() {
  return (
    <Routes
      routes={[
        { path: '/', element: () => <ArticleView /> },
        {
          path: '/article/:id',
          element: (params: RouteParams) => (
            <ArticleDetailView id={params.id} />
          ),
        },
      ]}
    />
  );
}
