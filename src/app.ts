import { ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/view/articleView'
import { articleDetailView } from './ui/view/articleDetailView'
import {
  handleCategoryClick,
  handleNavigateBack,
  handleRouteClick,
} from './ui/logic/eventHandlers'
import { delegateEvents } from './logic/eventDelegator'
import { Router } from './router'
import './style.css'

export const router = new Router()

export const navigate = router.navigate.bind(router)

window.addEventListener('DOMContentLoaded', () => {
  router.setDefaultRoute(() => articleView('root'))
  router.addRoute('/article/:id', () =>
    articleDetailView('root', ARTICLE_DETAIL),
  )

  router.go()
  delegateEvents([
    {
      selector: '.category-button',
      eventType: 'click',
      handler: handleCategoryClick,
    },
    {
      selector: '.navigate-back',
      eventType: 'click',
      handler: handleNavigateBack,
    },
    {
      selector: '[data-route]',
      eventType: 'click',
      handler: handleRouteClick,
    },
  ])
})
