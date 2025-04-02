import { ARTICLE_LIST, ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/view/articleView'
import { articleDetailView } from './ui/view/articleDetailView'
import { handleCategoryClick } from './ui/logic/eventHandlers'
import { delegateEvents } from './logic/eventDelegator'
import { Router } from './router'
import './style.css'

const router = new Router()

window.navigate = router.navigate.bind(router)
window.addEventListener('DOMContentLoaded', () => {
  router.setDefaultRoute(() => articleView('root', ARTICLE_LIST))
  router.addRoute('/article', () => articleDetailView('root', ARTICLE_DETAIL))
  router.go()
  delegateEvents([
    {
      selector: '.category-button',
      eventType: 'click',
      handler: handleCategoryClick,
    },
  ])
})
