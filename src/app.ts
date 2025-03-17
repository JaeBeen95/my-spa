import { ARTICLE_LIST, ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/view/articleView'
import { articleDetailView } from './ui/view/articleDetailView'
import { handleCategoryClick } from './ui/logic/handleCategoryClick'
import './style.css'

function router(): void {
  const path = window.location.pathname

  if (path === '/' || path === '') {
    articleView('root', ARTICLE_LIST)
  } else {
    articleDetailView('root', ARTICLE_DETAIL)
  }
}

function navigate(path: string, updateView: boolean = true): void {
  history.pushState({}, '', path)
  if (updateView) {
    router()
  }
}

window.navigate = navigate
document.addEventListener('popstate', router)
document.addEventListener('DOMContentLoaded', () => {
  router()
  handleCategoryClick()
})
