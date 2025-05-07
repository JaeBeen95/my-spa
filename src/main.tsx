/* @jsx createElement */
import { App } from './App';
import { createElement, render } from './react';
import './style.css';

render(<App />, document.querySelector('#root')!);
