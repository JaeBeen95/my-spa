import { ARTICLE_LIST, CATEGORIES } from './mock'
import { articleView } from './ui/articleView'
import { clickCategory } from './logic/clickCategory'
import './style.css'

articleView('root', CATEGORIES, ARTICLE_LIST)
document.addEventListener('DOMContentLoaded', clickCategory)
