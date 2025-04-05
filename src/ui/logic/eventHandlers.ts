import { ARTICLE_LIST } from '../../mock'
import { articleView } from '../view/articleView'

export function handleCategoryClick(event: Event, target: Element): void {
  event.preventDefault()

  document.querySelectorAll('.category-button').forEach((btn) => {
    btn.classList.remove('after:w-full')
    btn.classList.add('after:w-0')
  })

  target.classList.remove('after:w-0')
  target.classList.add('after:w-full')

  const route = target.getAttribute('data-route')
  if (route) {
    window.navigate(route, false)
    articleView('root', ARTICLE_LIST)
  }
}

export function handleNavigateBack(event: Event): void {
  event.preventDefault()
  window.history.back()
}
