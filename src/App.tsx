import { initializeApp } from '@firebase/app';
import { getAuth,onAuthStateChanged } from '@firebase/auth';
import * as React from 'react';
import './style.css';
import Orders from './Orders';
import config from './config';


export default class App extends React.Component {
  constructor(props: any){
    super(props);
    const app = initializeApp(config);

onAuthStateChanged(getAuth(app), (user) => {
  console.log(user, 'index');
  //wipedata
});

    
  }
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
