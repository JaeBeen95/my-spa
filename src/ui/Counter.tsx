/** @jsx createElement */
import { createElement, useEffect, useState } from '../react';

export default function StateTest() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setLog((prev) => [...prev, `useEffect: count is ${count}`]);
  }, [count]);

  const increase = () => {
    setLog((prev) => [...prev, `setCount called with ${count + 1}`]);
    setCount((c) => c + 1);
  };

  const reset = () => {
    setLog((prev) => [...prev, 'setCount reset to 0', '로그 초기화됨']);
    setCount(0);
    setLog(['초기화됨']);
  };

  return (
    <div class="p-4 font-sans">
      <h2 class="text-xl font-bold mb-2">🧪 useState 테스트</h2>
      <p class="text-lg mb-2">카운트: {count}</p>
      <div class="mb-4">
        <button
          class="px-3 py-1 bg-blue-500 text-white rounded mr-2"
          onClick={increase}
        >
          증가
        </button>
        <button
          class="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={reset}
        >
          리셋
        </button>
      </div>
      <pre class="text-sm text-gray-700 whitespace-pre-wrap">
        {log.join('\n')}
      </pre>
    </div>
  );
}
