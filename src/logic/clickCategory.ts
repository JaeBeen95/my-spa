export function clickCategory(): void {
  const buttons = document.querySelectorAll('button[data-category]')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.classList.remove('after:w-full'))
      button.classList.remove('after:w-0')

      button.classList.add('after:w-full')
    })
  })
}
