import * as React from 'react';
import Orders from './Orders';
import './style.css';


export default class App extends React.Component {


  render() {
    return (
      <div className="appContainer">
        <nav>
          <h1>Toke-N-Tally</h1>
        </nav>
        <Orders />
        <small>
          I'm working on integration with the state. I hope the extension is
          useful without it for the time.
        </small>
      </div>)
  }

}
