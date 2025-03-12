import './style.css'

const container: HTMLElement | null = document.getElementById('root')

if (!container) throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'

container.innerHTML = `
<div class="text-xl">hello world</div>
`
