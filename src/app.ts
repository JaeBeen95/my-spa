import { ARTICLE_LIST, CATEGORIES, ARTICLE_DETAIL } from './mock'
import { articleView } from './ui/articleView'
import { clickCategory } from './logic/clickCategory'
import './style.css'
import { articleDetailView } from './ui/articleDetailView'

// articleView('root', CATEGORIES, ARTICLE_LIST)
articleDetailView('root', ARTICLE_DETAIL)
document.addEventListener('DOMContentLoaded', clickCategory)
