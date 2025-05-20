/** @jsx createElement */
import { createElement } from './react';
import { useRouter } from './router';
import { ArticleDetailView } from './ui/view/ArticleDetailView';
import { ArticleView } from './ui/view/ArticleView';
import { ARTICLE_DETAIL } from './mock';

export function App(): JSX.Element {
  const router = useRouter();

  router.setDefaultRoute(() => <ArticleView />, '/');

  router.addRoute('/article/:id', () => (
    <ArticleDetailView article={ARTICLE_DETAIL} />
  ));

  return router.createPage();
}
