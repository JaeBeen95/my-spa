import { useNavigate } from '../../router';

const navigate = useNavigate();

export function handleCategoryClick(_: Event, el: Element): void {
  const categoryId = el.getAttribute('data-category') || 'all';
  navigate(`/${categoryId}`);
}

export function handleNavigateBack(event: Event): void {
  event.preventDefault();
  window.history.back();
}

export function handleRouteClick(_: Event, el: Element) {
  const path = el.getAttribute('data-route');
  if (path) {
    navigate(path);
  }
}
