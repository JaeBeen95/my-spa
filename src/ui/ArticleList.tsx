/** @jsx createElement */
import { createElement } from '../react';
import { ArticleCard } from './ArticleCard';
import type { Article } from '../types';

interface Props {
  articles: Article[];
}

export function ArticleList({ articles }: Props): JSX.Element {
  return (
    <ul class="space-y-8">
      {articles.map((article) => (
        <ArticleCard article={article} />
      ))}
    </ul>
  );
}
