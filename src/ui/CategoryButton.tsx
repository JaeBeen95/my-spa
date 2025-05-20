/** @jsx createElement */
import { createElement } from '../react';
import { useNavigate } from '../router';
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
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/${category.id}`);
  };

  return (
    <button
      class={`category-button relative px-4 py-2 group after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gray-900 ${activeClass}`}
      onClick={handleCategoryClick}
    >
      <span>{category.label}</span>
    </button>
  );
}
