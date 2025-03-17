import { ARTICLE_LIST, CATEGORIES, ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/view/articleView'
import { articleDetailView } from './ui/view/articleDetailView'
import { clickCategory } from './logic/clickCategory'
import './style.css'

function router(): void {
  const path = window.location.pathname

  if (path === '/' || path === '') {
    articleView('root', ARTICLE_LIST)
  } else {
    articleDetailView('root', ARTICLE_DETAIL)
  }
}

function navigate(path: string): void {
  history.pushState({}, '', path)
  router()
}

document.navigate = navigate
document.addEventListener('popstate', router)
document.addEventListener('DOMContentLoaded', clickCategory)

router()
