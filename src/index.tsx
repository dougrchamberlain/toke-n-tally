import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import config from './config';
import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <Login/>
  </React.StrictMode>
);



const app = initializeApp(config);

onAuthStateChanged(getAuth(app), (user) => {
  console.log(user, 'index');
  //wipedata
});



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
