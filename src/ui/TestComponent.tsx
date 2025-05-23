/** @jsx createElement */
import { createElement, useState } from '../react';

export default function TestComponent() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('초기값');

  console.log('렌더링 시점 - count:', count, 'message:', message);

  return (
    <div>
      <div>Count: {count}</div>
      <div>Message: {message}</div>
      <button onClick={() => setCount((c) => c + 1)}>Count 증가</button>
      <button onClick={() => setMessage('변경됨')}>Message 변경</button>
    </div>
  );
}
