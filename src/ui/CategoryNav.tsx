/** @jsx createElement */
import { createElement } from '../react';
import { CategoryButton } from './CategoryButton';
import type { Category } from '../types';

interface Props {
  categories: Category[];
}

export function CategoryNav({ categories }: Props) {
  return (
    <nav class="mb-8 flex gap-4">
      {categories.map((category) => (
        <CategoryButton
          category={category}
        />
      ))}
    </nav>
  );
}
