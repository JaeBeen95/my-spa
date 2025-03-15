import { renderView } from '../logic/renderView'
import { ArticleDetail } from '../types'

export function articleDetailView(
  container: string,
  articleDetail: ArticleDetail,
): void {
  const containerElement: HTMLElement | null =
    document.getElementById(container)

  let template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <article class="space-y-8">
          <button 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onclick="history.back()"
          >
            뒤로가기
          </button>

          <header class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-gray-200 rounded-full text-sm">
                ${articleDetail.category}
              </span>
              <time class="text-gray-500">${articleDetail.time}</time>
            </div>
            <h1 class="text-4xl font-bold">${articleDetail.title}</h1>
            <p class="text-xl text-gray-600">${articleDetail.description}</p>
          </header>

          <figure class="aspect-video">
            <img
              src="${articleDetail.imgSrc}"
              alt="${articleDetail.imgDescription}"
              class="w-full h-full object-cover rounded-2xl bg-gray-100"
            />
          </figure>

          <div class="prose prose-lg max-w-none">
            ${articleDetail.content}
          </div>
        </article>
      </div>
    </section>
  `

  renderView(containerElement, template)
}
