/** @jsx createElement */
import { createElement } from '../../react';
import { ARTICLE_DETAIL } from '../../mock';
import type { ArticleDetail } from '../../types';
import { useNavigate } from '../../router';

export function ArticleDetailView(): JSX.Element {
  const article: ArticleDetail = ARTICLE_DETAIL;
  const navigate = useNavigate();

  const handleClick = (e: Event) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <article class="space-y-8">
          <button
            class="navigate-back flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={handleClick}
          >
            뒤로가기
          </button>

          <header class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {article.category}
              </span>
              <time class="text-gray-500">{article.time}</time>
            </div>
            <h1 class="text-4xl font-bold">{article.title}</h1>
            <p class="text-xl text-gray-600">{article.description}</p>
          </header>

          <figure class="aspect-video">
            <img
              src={article.imgSrc}
              alt={article.imgDescription}
              class="w-full h-full object-cover rounded-2xl bg-gray-100"
            />
          </figure>

          <div class="prose prose-lg max-w-none" innerHTML={article.content} />
        </article>
      </div>
    </section>
  );
}
