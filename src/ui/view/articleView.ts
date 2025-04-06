import { categoryNav } from '../categoryNav'
import { articleList } from '../articleList'
import { renderView } from '../logic/renderView'
import { ARTICLE_LIST, CATEGORIES } from '../../mock'

export function articleView(containerId: string): void {
  const containerElement = document.getElementById(containerId)
  if (!containerElement) return

  const categoryId = window.location.pathname.slice(1) || 'all'
  const filteredCategory =
    categoryId === 'all'
      ? ARTICLE_LIST
      : ARTICLE_LIST.filter((article) => article.category === categoryId)

  const template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          ${categoryNav(CATEGORIES, categoryId)}
        </header>
        <main>
          ${articleList(filteredCategory)}
        </main>
      </div>
    </section>
  `

  renderView(containerElement, template)
}
