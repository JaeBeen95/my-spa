/** @jsx createElement */
import { createElement } from '../react';
import type { Category } from '../types';

interface Props {
  category: Category;
  activeCategoryId: string;
}

export function CategoryButton({
  category,
  activeCategoryId,
}: Props): JSX.Element {
  const isActive = category.id === activeCategoryId;
  const activeClass = isActive ? 'after:w-full' : 'after:w-0';

  return (
    <button
      class={`category-button relative px-4 py-2 group after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gray-900 ${activeClass}`}
      data-category={category.id}
    >
      <span>{category.label}</span>
    </button>
  );
}
