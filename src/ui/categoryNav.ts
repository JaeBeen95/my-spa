import { categoryButton } from './categoryButton'
import type { Category } from '../types'

export function categoryNav(categories: Category[]): string {
  return `
    <nav class="mb-8 flex gap-4">
      ${categories.map(categoryButton).join('')}
    </nav>
  `
}
