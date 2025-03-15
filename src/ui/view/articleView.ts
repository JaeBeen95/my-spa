import { categoryNav } from '../categoryNav'
import { articleList } from '../articleList'
import { renderView } from '../../logic/renderView'
import { CATEGORIES } from '../../mock'
import type { Article } from '../../types'

export function articleView(container: string, articles: Article[]): void {
  const containerElement: HTMLElement | null =
    document.getElementById(container)

  let template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          ${categoryNav(CATEGORIES)}
        </header>
        <main>
          ${articleList(articles)}
        </main>
      </div>
    </section>
  `

  renderView(containerElement, template)
}
