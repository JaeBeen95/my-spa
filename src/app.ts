import './style.css'

const rootElement: HTMLElement | null = document.getElementById('root')

if (!rootElement) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'

rootElement.innerHTML = `
<div class="text-xl">hello world</div>
`
