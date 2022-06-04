import { getApp, initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, set } from '@firebase/database';
import * as React from 'react';
import BubbleDisplay from './BubbleDisplay';
import config from './config';

export default class Orders extends React.Component<any,any> {
  constructor(props: any) {
    super(props);
    this.state = { amountAllowed: 2.1 };
    this.setAmountAllowed = this.setAmountAllowed.bind(this);
    this.syncAmounts = this.syncAmounts.bind(this);
  }

  setAmountAllowed(e : any) {
    var raw = e.target.value;
    this.setState({ amountAllowed: parseFloat(raw) });
  }

  syncAmounts() {
    var app = null;
    try {
      app = getApp();
      console.log(app);
    } catch (ex) {
      console.log(ex);
      app = initializeApp(config);
    }

    const auth = getAuth(app);
    const db = getDatabase();
    set(ref(db, `users/${auth.currentUser?.uid}`), {
      uploadDate: new Date().toUTCString(),
      amountAllowed: this.state.amountAllowed,
    });
  }

  render() {
    return (
      <section>
        <div className="order--info">
          <BubbleDisplay
            available={this.state?.amountAllowed}
            max={2.5}
            displayLabel={'Flower'}
            reupDate="06/09/2022"
          />
          <BubbleDisplay
            available={3000}
            max={14000}
            displayLabel={'Concentrates'}
            reupDate=""
          />
          <BubbleDisplay
            available={12000}
            max={12000}
            displayLabel={'Edibles'}
            reupDate=""
          />
        </div>
        <div className="manual--uploadForm">
          <input
            id="amountAllowed"
            type="text"
            name="amountAllowed"
            placeholder="Amount Available"
            onChange={this.setAmountAllowed}
          />
          <button onClick={this.syncAmounts}>Sync Amounts</button>
        </div>
      </section>
    );
  }
}
