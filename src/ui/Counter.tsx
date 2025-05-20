/** @jsx createElement */
import { createElement, useState } from '../react';

export default function Counter() {
  const [count, setCount] = useState(0);
  console.log(count);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return (
    <div>
      <div>{count}</div>
      <button onClick={handleClick}>버튼</button>
    </div>
  );
}
