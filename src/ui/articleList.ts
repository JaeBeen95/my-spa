import { articleCard } from './articleCard'
import type { Article } from '../types'

export function articleList(articles: Article[]): string {
  return `
    <ul class="space-y-8">
      ${articles.map(articleCard).join('')}
    </ul>
  `
}
