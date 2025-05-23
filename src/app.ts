import { ARTICLE_LIST, ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/view/articleView'
import { articleDetailView } from './ui/view/articleDetailView'
import { addRoute, navigate, router, setDefaultRoute } from './router'
import { handleCategoryClick } from './ui/logic/handleCategoryClick'
import './style.css'

window.navigate = navigate
window.addEventListener('DOMContentLoaded', () => {
  setDefaultRoute(() => articleView('root', ARTICLE_LIST))
  addRoute('/article', () => articleDetailView('root', ARTICLE_DETAIL))
  router()
  handleCategoryClick()
})
