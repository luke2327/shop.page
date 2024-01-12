export function useDebounce(func: (event: React.ChangeEvent<HTMLInputElements>) => void, delay: number) {
  let debounceTimer: NodeJS.Timeout

  return function (...event: [React.ChangeEvent<HTMLInputElements>]) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply({}, event), delay)
  }
}
