/** @jsx createElement */
import { createElement } from '../react';
import { Link } from '../router';
import type { Article } from '../types';

interface Props {
  article: Article;
}

export function ArticleCard({ article }: Props): JSX.Element {
  return (
    <li>
      <Link
        to={`/article/${article.id}`}
        class="group flex flex-col md:flex-row md:items-center gap-6 cursor-pointer route-link no-underline"
      >
        <div class="flex-1 space-y-2">
          <h2 class="text-2xl font-bold transition-colors group-hover:text-blue-600">
            {article.title}
          </h2>
          <p class="text-gray-600">{article.description}</p>
          <time class="text-sm text-gray-500">{article.time}</time>
        </div>
        <figure class="md:w-52 shrink-0">
          <img
            src={article.imgSrc}
            alt={article.imgDescription}
            class="w-full h-full object-cover rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
      </Link>
    </li>
  );
}
