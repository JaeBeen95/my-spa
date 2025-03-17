import type { Category } from '../types'

export function categoryButton(category: Category): string {
  const isActive = category.id === 'all'
  const activeClass = isActive ? 'after:w-full' : 'after:w-0'
  const route = isActive ? '/' : `/${category.id}`

  return `
    <button 
      class="relative px-4 py-2 group category-button after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gray-900 ${activeClass}"
      onclick="navigate('${route}', false)">
      <span>${category.label}</span>
    </button>
  `
}
