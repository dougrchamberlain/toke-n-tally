import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged, browserSessionPersistence } from '@firebase/auth';
import { getDatabase, onValue, ref, set } from '@firebase/database';
import * as React from 'react';
import { ChangeEvent } from 'react';
import BubbleDisplay from './BubbleDisplay';
import config from './config';

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase(app);

const DUTCHIE_EMBEDDED_URL = 'https://dutchie.com';
const DUTCHIE_addProduct = 'add_to_cart';
const DUTCHIE_removeProduct = 'remove_from_cart';

//dispensed property
//remaining property

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
    this.onDutchieMessage = this.onDutchieMessage.bind(this);

  }

  onDutchieMessage(event: MessageEvent) {
    // i.e. '1/2' -> .5
    // Invalid input returns 0 so impact on upstream callers are less likely to be impacted
    function fractionToNumber(fraction = '') {
      const fractionParts = fraction.split('/');
      const numerator = fractionParts[0] || '0';
      const denominator = fractionParts[1] || '1';
      const radix = 10;
      const number = parseInt(numerator, radix) / parseInt(denominator, radix);
      const result = number || 0;

      return result;
    }
    if (event.origin === DUTCHIE_EMBEDDED_URL) {
      const dataObject = JSON.parse(event.data);
      if (dataObject.event !== 'analytics:dataLayer') {
        return;
      }
      //dutchie has two properties. playload an payload.
      const { payload: { ecommerce },event:cartEvent } = dataObject.payload;
      console.log(cartEvent)
      if(!ecommerce){
        return;
      }
      const [item] = ecommerce.items;

      const { item_variant, quantity } = item
      const fraction = item_variant.replace(/oz/, '');
      const delta = fractionToNumber(fraction) * quantity;
      let newAmount = 0;
      console.log(ecommerce.event);
      switch (ecommerce.event) {
        case DUTCHIE_addProduct:
          {

             newAmount = this.state.orders.amountAllowed - delta
             console.log(newAmount);
          }
          break;
        case DUTCHIE_removeProduct:
          {

             newAmount = this.state.orders.amountAllowed + delta
             console.log(newAmount);
          }
          break;
      }
      const uid = auth.currentUser?.uid;
      const ordersRef = ref(db, `orders/${uid}`);

      this.setState((prev:any) =>({
        orders:{
          ...prev.orders,
          amountAllowed: newAmount
        }
      }));
      set(ordersRef,  this.state.orders
      ).then((v) => {
        console.log(v);
      })


    }
  }


  componentDidMount() {
    this.fetchData();
    window.addEventListener('message', this.onDutchieMessage);
  }

  fetchData() {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        const { uid } = user;
        const ordersRef = ref(db, `orders/${uid}`);

        onValue(ordersRef, (snapshot) => {
          this.setState({ orders: snapshot.val() })
        })
      }
    })


  }

  setAmountAllowed(e: ChangeEvent<{ value: string }>) {
    const { value } = e.currentTarget;
    //fix this. it's over complicated and lazy
    const orders = JSON.parse(JSON.stringify(this.state.orders))
    orders.amountAllowed = value;

    this.setState({ orders });
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
      <div className="order--info">
        <div >
          <BubbleDisplay
            available={amountAllowed}
            max={limit || 2.5}
            displayLabel={productType}
            reupDate={reupDates[0]}
          />
        </div>
        <div className="manual--uploadForm">
          <span>{amountAllowed}/{limit}</span>
          <input
            id="amountAllowed"
            type="number"
            name="amountAllowed"
            placeholder="Amount Available"
            onChange={this.setAmountAllowed}
            onBlur={this.syncAmounts}
            step="0.01"
            max={limit}
            value={amountAllowed}
          />
        </div>
        <div className='iframe--store'>
          <iframe id='iframe-store' title='iframe-store' src="https://dutchie.com/embedded-menu/curaleaf-fl-st-petersburg/products/flower?">
            NO IFRAMES
          </iframe>
        </div>
      </div>
    );
  }
}
