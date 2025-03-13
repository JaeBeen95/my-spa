export function renderView(
  element: HTMLElement | null,
  template: string,
): void {
  if (!element) throw '최상위 container가 없어서 UI를 진행할 수 없습니다.'
  element.innerHTML = template
}
