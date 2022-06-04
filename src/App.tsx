import * as React from 'react';
import './style.css';
import Orders from './Orders';

export default function App() {
  return (
    <div className="appContainer">
      <nav>
        <h1>Flower Power</h1>
      </nav>
      <Orders />
      <small>
        I'm working on integration with the state. I hope the extension is
        useful without it for the time.
      </small>
    </div>
  );
}
