import './style.css'

const container: HTMLElement | null = document.getElementById('root')

const MOCK_CATEGORY = [
  { id: 'all', label: '전체' },
  { id: 'dev', label: '개발' },
  { id: 'design', label: '디자인' },
]

const MOCK_ARTICLE_LIST = [
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

function articleLayout() {
  let template = `
    <section class="text-gray-900 p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <header>
          {{__categoryNav__}}
        </header>
        <main>
          {{__articleList__}}
        </main>
      </div>
    </section>
  `

  if (!container) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'

  template = template.replace('{{__categoryNav__}}', categoryNav())
  template = template.replace('{{__articleList__}}', articleList())
  container.innerHTML = template
}

function categoryNav() {
  let template = `
    <nav class="mb-8 flex gap-4">
      {{__categoryButton__}}
    </nav>
  `

  template = template.replace('{{__categoryButton__}}', categoryButton())
  return template
}

function categoryButton() {
  let template = `
    <button
      class="px-4 py-2 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900 after:hidden hover:after:block"
      data-category="all"
    >
      전체
    </button>
  `

  return template
}

function articleList() {
  let template = `
    <ul class="space-y-8">
      {{__articleCard__}}
    </ul>
  `

  template = template.replace('{{__articleCard__}}', articleCard())
  return template
}

function articleCard() {
  let template = `
    <li class="group flex flex-col md:flex-row md:items-center gap-6 cursor-pointer">
      <div class="flex-1 space-y-2">
        <h2 class="text-2xl font-bold transition-colors group-hover:text-blue-600">
          자바스크립트 성능 최적화
        </h2>
        <p class="text-gray-600">
          빠른 웹사이트를 만들기 위한 최적화 기법들을 상세히 알아봅니다. 실제 사례를 통해 성능 개선 방법을 살펴보고, 최적의 사용자 경험을 제공하는 방법을 소개합니다.
        </p>
        <time class="text-sm text-gray-500">2024.01.15</time>
      </div>
      <figure class="md:w-52 shrink-0">
        <img
          src="https://placehold.co/400x300"
          alt="자바스크립트 성능 최적화 관련 이미지"
          class="w-full h-full object-cover rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
    </li> 
  `

  return template
}

articleLayout()
