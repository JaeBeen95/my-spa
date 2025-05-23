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

  const handleClick = () => {
    const path = category.id === 'all' ? '/' : `/${category.id}`;
    navigate(path); // ✅ 쿼리 사용 안 하고 pathname만 변경
  };

  return (
    <button
      class={`category-button relative px-4 py-2 group after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gray-900 ${activeClass}`}
      onClick={handleClick}
    >
      <span>{category.label}</span>
    </button>
  );
}
