import { categoryButton } from './categoryButton'
import type { Category } from '../types'

export function categoryNav(
  categories: Category[],
  activeCategoryId: string,
): string {
  return `
    <nav class="mb-8 flex gap-4">
        ${categories
          .map((category) => categoryButton(category, activeCategoryId))
          .join('')}
    </nav>
  `
}
