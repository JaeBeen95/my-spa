/** @jsx createElement */
import { createElement } from '../react';
import { CategoryButton } from './CategoryButton';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  activeCategoryId: string;
}

export function CategoryNav({ categories, activeCategoryId }: Props) {
  return (
    <nav class="mb-8 flex gap-4">
      {categories.map((category) => (
        <CategoryButton
          category={category}
          activeCategoryId={activeCategoryId}
        />
      ))}
    </nav>
  );
}
