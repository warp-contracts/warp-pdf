/* @refresh reload */
import { render } from 'solid-js/web';

import './index.scss';
import { Buffer } from 'buffer';
import { Router, Routes, Route } from '@solidjs/router';
import Admin from './Admin/Admin';
import App from './App/App';

globalThis.Buffer = Buffer;

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path='/admin' component={Admin} />
        <Route path='/' component={App} />
      </Routes>
    </Router>
  ),
  root!
);
