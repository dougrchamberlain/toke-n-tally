import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getDatabase, onValue, ref, set } from '@firebase/database';
import * as React from 'react';
import { ChangeEvent } from 'react';
import BubbleDisplay from './BubbleDisplay';
import config from './config';

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase(app);

export default class Orders extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      orders: {
        amountAllowed: 0,
        productType: "",
        reupDates: [],
        limit: 2.5
      }
    };
    this.setAmountAllowed = this.setAmountAllowed.bind(this);
    this.syncAmounts = this.syncAmounts.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    onAuthStateChanged(auth, (user: any) => {
      const { uid } = user;
      const ordersRef = ref(db, `orders/${uid}`);

      onValue(ordersRef, (snapshot) => {
        console.log(snapshot.val());
        this.setState({ orders: snapshot.val() })
      })
    })


  }

  setAmountAllowed(e: ChangeEvent<{ value: string }>) {
    const { value } = e.currentTarget;
    this.setState({ orders: { amountAllowed: value } });
  }


  syncAmounts() {
    const uid = auth.currentUser?.uid;
    const ordersRef = ref(db, `orders/${uid}/amountAllowed`);

    set(ordersRef, this.state.orders.amountAllowed
    ).then((v) => {
      console.log(v);
    })
  }

  render() {
    const {
      amountAllowed,
      productType,
      reupDates,
      limit
    } = this.state.orders;

    return (
      <section>
        <div className="order--info">
          <BubbleDisplay
            available={amountAllowed}
            max={limit || 2.5}
            displayLabel={productType}
            reupDate={reupDates}
          />
        </div>
        <div className="manual--uploadForm">
          <input
            id="amountAllowed"
            type="number"
            name="amountAllowed"
            placeholder="Amount Available"
            onChange={this.setAmountAllowed}
            onBlur={this.syncAmounts}
            step="0.01"
            max="2.5"
          />
        </div>
      <div className='iframe--store'>
      <iframe title='iframe-store' src="https://dutchie.com/embedded-menu/curaleaf-fl-st-petersburg/products/flower?">
        NO IFRAMES
        </iframe>
      </div>
      </section>
    );
  }
}
