import { categoryNav } from './categoryNav'
import { articleList } from './articleList'
import type { Article, Category } from '../types'

export function articleView(
  container: string,
  categories: Category[],
  articles: Article[],
): void {
  const containerElement: HTMLElement | null =
    document.getElementById(container)

  let template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          ${categoryNav(categories)}
        </header>
        <main>
          ${articleList(articles)}
        </main>
      </div>
    </section>
  `

  if (!containerElement) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'
  containerElement.innerHTML = template
}
