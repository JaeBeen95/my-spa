/** @jsx createElement */

import { ARTICLE_LIST, CATEGORIES } from '../../mock';
import { createElement } from '../../react';
import { ArticleList } from '../ArticleList';
import { CategoryNav } from '../CategoryNav';

export function ArticleView(): JSX.Element {
  const categoryId = window.location.pathname.slice(1) || 'all';

  const filteredCategory =
    categoryId === 'all'
      ? ARTICLE_LIST
      : ARTICLE_LIST.filter((article) => article.category === categoryId);

  return (
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          <CategoryNav categories={CATEGORIES} activeCategoryId={categoryId} />
        </header>
        <main class="mt-4">
          <ArticleList articles={filteredCategory} />
        </main>
      </div>
    </section>
  );
}
