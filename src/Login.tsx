import { initializeApp } from '@firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword, signOut, User
} from '@firebase/auth';
import * as React from 'react';
import config from './config';
import './style.css';

export default class Login extends React.Component<any,any> {
 
  constructor(props: any){
    super(props);

    this.state = {email:'', password:'', user:null}
    const app = initializeApp(config);

    onAuthStateChanged(getAuth(app), (user) => {
      console.log(user, 'index');
      //wipedata
    });

  }
   logoff() {
    const app = initializeApp(config);
    const auth = getAuth(app);
    signOut(auth).then((value)=>{
      console.log(value);
      this.setEmail('');
    })
    //this is needed to clear out the value in user object when signing out.
  }

  signIn() {
    //push to firebase
    const app = initializeApp(config);
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then(function (userCredential) {
        // Signed in
        const user: User = userCredential.user;

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  
  }
 setEmail(value:string) {
  this.setState({email: value})
}

setPassword(value:string){
  this.setState({password: value })
}

render(): React.ReactNode {
  if (this.state.user?.email) {
    return (
      <div>
        <span>{this.state.user.email}</span>
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