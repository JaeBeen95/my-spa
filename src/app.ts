import './style.css'

const container: HTMLElement | null = document.getElementById('root')

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'dev', label: '개발' },
  { id: 'design', label: '디자인' },
]

const ARTICLE_LIST = [
  {
    id: 0,
    title: '자바스크립트 성능 최적화',
    description:
      '빠른 웹사이트를 만들기 위한 최적화 기법들을 상세히 알아봅니다. 실제 사례를 통해 성능 개선 방법을 살펴보고, 최적의 사용자 경험을 제공하는 방법을 소개합니다.',
    time: '2024.01.15',
    imgSrc: 'https://placehold.co/400x300',
    imgDescription: '자바스크립트 성능 최적화 관련 이미지',
  },
  {
    id: 1,
    title: 'UI/UX 기본 원칙',
    description:
      '사용자를 배려하는 디자인을 위한 핵심 개념들을 살펴봅니다. 현대적인 디자인 트렌드와 함께 실용적인 UI/UX 설계 방법론을 다룹니다.',
    time: '2024.01.14',
    imgSrc: 'https://placehold.co/400x300',
    imgDescription: 'UI/UX 디자인 관련 이미지',
  },
  {
    id: 2,
    title: 'React 상태 관리 라이브러리 비교',
    description:
      'Redux, Recoil, Zustand 중 어떤 걸 선택해야 할지 비교 분석합니다. 각 라이브러리의 장단점과 적절한 사용 사례를 소개합니다.',
    time: '2024.01.13',
    imgSrc: 'https://placehold.co/400x300',
    imgDescription: 'React 상태 관리 라이브러리 관련 이미지',
  },
]

interface Category {
  id: string
  label: string
}

interface Article {
  id: number
  title: string
  description: string
  time: string
  imgSrc: string
  imgDescription: string
}

function articleLayout(categories: Category[], articles: Article[]): void {
  let template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          ${categoryNav(categories)}
        </header>
        <main>
          ${articleList(articles)}
        </main>
      </div>
    </section>
  `

  if (!container) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'
  container.innerHTML = template
}

function categoryNav(categories: Category[]): string {
  return `
    <nav class="mb-8 flex gap-4">
      ${categories.map(categoryButton).join('')}
    </nav>
  `
}

function categoryButton(category: Category): string {
  return `
    <button
      class="px-4 py-2 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900 after:hidden hover:after:block"
      data-category="${category.id}"
    >
      ${category.label}
    </button>
  `
}

function articleList(articles: Article[]): string {
  return `
    <ul class="space-y-8">
      ${articles.map(articleCard).join('')}
    </ul>
  `
}

function articleCard(article: Article): string {
  return `
    <li class="group flex flex-col md:flex-row md:items-center gap-6 cursor-pointer">
      <div class="flex-1 space-y-2">
        <h2 class="text-2xl font-bold transition-colors group-hover:text-blue-600">
          ${article.title}
        </h2>
        <p class="text-gray-600">
          ${article.description}
        </p>
        <time class="text-sm text-gray-500">${article.time}</time>
      </div>
      <figure class="md:w-52 shrink-0">
        <img
          src="${article.imgSrc}"
          alt="${article.imgDescription}"
          class="w-full h-full object-cover rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
    </li> 
  `
}

articleLayout(CATEGORIES, ARTICLE_LIST)
