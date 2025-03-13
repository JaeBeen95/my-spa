import type { Category } from '../types'

export function categoryButton(category: Category): string {
  return `
    <button class="relative px-4 py-2 group" data-category="${category.id}">
      ${category.label}
      <div class="absolute left-0 bottom-0 h-0.5 w-full bg-gray-900"></div>
    </button>
  `
}
