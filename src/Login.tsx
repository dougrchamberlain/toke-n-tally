import { getAnalytics } from '@firebase/analytics';
import { initializeApp } from '@firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword, signOut, User
} from '@firebase/auth';
import * as React from 'react';
import config from './config';
import './style.css';

export default class Login extends React.Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = { email: '', password: '', name:'' }
    const app = initializeApp(config);
    const auth = getAuth(app);
    const analytics = getAnalytics(app);
    analytics.app.automaticDataCollectionEnabled = true;




    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if(user){
      this.setState({name: user.email})
      }
    });
 
  }
  logoff() {
    const app = initializeApp(config);
    const auth = getAuth(app);
    signOut(auth).then((value) => {
      console.log(value);
      this.setEmail('');
    })
    //this is needed to clear out the value in user object when signing out.
  }

  signIn() {
    //push to firebase
 
    const app = initializeApp(config);
    const auth = getAuth(app);
    const {email,password} = this.state;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user: User = userCredential.user;
          this.setState({name: user.displayName})
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

  }
  setEmail(value: string) {
    this.setState({ email: value })
  }

  setPassword(value: string) {
    this.setState({ password: value })
  }

  render(): React.ReactNode {
    if (this.state.name) {
      return (
        <div>
        
<button onClick={this.logoff}>Sign Out/LogOff</button>

        </div>
      );
    } else {
      return (
        <div className="login--page">
          <section>
            <input
              onChange={(e) => this.setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="email"
            />
            <input
              type="password"
              name="password"
              onChange={(e) => this.setPassword(e.target.value)}
              placeholder="password"
            />
            <button onClick={this.signIn}>Sign In</button>
          </section>
        </div>
      );
    }

  }
}