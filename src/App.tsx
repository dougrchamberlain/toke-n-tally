import * as React from 'react';
import Orders from './Orders';
import './style.css';


export default class App extends React.Component {


  render() {
    return (
      <div className="appContainer">
        <nav>
          <h1>Toke-N-Tally</h1>
            <menu type="toolbar">
              
            </menu>
        </nav>
        <Orders human="" />
        
      </div>)
  }

}
