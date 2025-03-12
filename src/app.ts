import './style.css'

const container: HTMLElement | null = document.getElementById('root')

if (!container) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'

container.innerHTML = `
  <section class="text-gray-900 p-6 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <header>
        <nav class="mb-8 flex gap-4">
          <button
            class="px-4 py-2 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900 after:hidden hover:after:block"
            data-category="all"
          >
            전체
          </button>
          <button
            class="px-4 py-2 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900 after:hidden hover:after:block"
            data-category="dev"
          >
            개발
          </button>
          <button
            class="px-4 py-2 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900 after:hidden hover:after:block"
            data-category="design"
          >
            디자인
          </button>
        </nav>
      </header>

      <main>
        <ul class="space-y-8">
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

          <li class="group flex flex-col md:flex-row md:items-center gap-6 cursor-pointer">
            <div class="flex-1 space-y-2">
              <h2 class="text-2xl font-bold transition-colors group-hover:text-blue-600">
                UI/UX 기본 원칙
              </h2>
              <p class="text-gray-600">
                사용자를 배려하는 디자인을 위한 핵심 개념들을 살펴봅니다. 현대적인 디자인 트렌드와 함께 실용적인 UI/UX 설계 방법론을 다룹니다.
              </p>
              <time class="text-sm text-gray-500">2024.01.14</time>
            </div>
            <figure class="md:w-52 shrink-0">
              <img
                src="https://placehold.co/400x300"
                alt="UI/UX 디자인 관련 이미지"
                class="w-full h-full object-cover rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
              />
            </figure>
          </li>

          <li class="group flex flex-col md:flex-row md:items-center gap-6 cursor-pointer">
            <div class="flex-1 space-y-2">
              <h2 class="text-2xl font-bold transition-colors group-hover:text-blue-600">
                React 상태 관리 라이브러리 비교
              </h2>
              <p class="text-gray-600">
                Redux, Recoil, Zustand 중 어떤 걸 선택해야 할지 비교 분석합니다. 각 라이브러리의 장단점과 적절한 사용 사례를 소개합니다.
              </p>
              <time class="text-sm text-gray-500">2024.01.13</time>
            </div>
            <figure class="md:w-52 shrink-0">
              <img
                src="https://placehold.co/400x300"
                alt="React 상태 관리 라이브러리 관련 이미지"
                class="w-full h-full object-cover rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
              />
            </figure>
          </li>
        </ul>
      </main>
    </div>
  </section>
`
