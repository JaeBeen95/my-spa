/** @jsx createElement */
import { createElement } from './react';
import { useRouter } from './router';
import { ArticleDetailView } from './ui/view/ArticleDetailView';
import { ArticleView } from './ui/view/ArticleView';
import { ARTICLE_DETAIL } from './mock';
import { delegateEvents } from './logic/eventDelegator';
import {
  handleCategoryClick,
  handleNavigateBack,
  handleRouteClick,
} from './ui/logic/eventHandlers';

export function App(): JSX.Element {
  const router = useRouter();

  router.setDefaultRoute(() => <ArticleView />, '/');

  router.addRoute('/article/:id', () => (
    <ArticleDetailView article={ARTICLE_DETAIL} />
  ));

  delegateEvents([
    {
      selector: '[data-category]',
      eventType: 'click',
      handler: handleCategoryClick,
    },
    {
      selector: '[data-back]',
      eventType: 'click',
      handler: handleNavigateBack,
    },
    {
      selector: '[data-route]',
      eventType: 'click',
      handler: handleRouteClick,
    },
  ]);

  return router.createPage();
}
