/** @jsx createElement */
import { createElement } from '../../react';
import { useSearchParams } from '../../router';
import { ARTICLE_LIST, CATEGORIES } from '../../mock';
import { ArticleList } from '../ArticleList';
import { CategoryNav } from '../CategoryNav';

export function ArticleView(): JSX.Element {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || 'all';

  const filteredArticles =
    categoryId === 'all'
      ? ARTICLE_LIST
      : ARTICLE_LIST.filter((article) => article.category === categoryId);

  return (
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          <CategoryNav categories={CATEGORIES} />
        </header>
        <main class="mt-4">
          <ArticleList articles={filteredArticles} />
        </main>
      </div>
    </section>
  );
}
