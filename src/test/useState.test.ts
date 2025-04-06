import { useState } from '../hooks/useState'

describe('useState 테스트', () => {
  test('초기 값 반환', () => {
    const [state] = useState(1)
    expect(state).toBe(1)
  })

  test('setState 테스트', () => {
    const [state, setState] = useState(1)
    setState(2)
    expect(state).toBe(2)
  })
})
