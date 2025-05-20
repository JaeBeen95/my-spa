import { createRoot } from './react';
import { App } from './App';
import './style.css';

const root = createRoot(document.querySelector('#root')!);
root.render(App);
