/** @jsx createElement */
import { createElement } from '../react';
import { useSearchParams } from '../router';
import type { Category } from '../types';

interface Props {
  category: Category;
}

export function CategoryButton({ category }: Props): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const isActive = searchParams.get('category') === category.id;
  const activeClass = isActive ? 'after:w-full' : 'after:w-0';

  const handleClick = (e: Event) => {
    e.preventDefault();
    setSearchParams({ category: category.id });
  };

  return (
    <button
      onClick={handleClick}
      class={`category-button relative px-4 py-2 group after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gray-900 ${activeClass}`}
    >
      <span>{category.label}</span>
    </button>
  );
}
