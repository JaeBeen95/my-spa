export function useState<T>(initialValue: T): [T, (value: T) => void] {
  let state = initialValue

  function set(value: T) {
    state = value
  }

  return [state, set]
}
