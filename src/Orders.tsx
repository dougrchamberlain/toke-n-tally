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

const DUTCHIE_EMBEDDED_URL = 'https://dutchie.com';
const DUTCHIE_addProduct = 'ec:addProduct';
const DUTCHIE_removeProduct = 'ec:removeProduct';

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

  onDutchieMessage({ data, origin }: MessageEvent) {
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
    if (origin === DUTCHIE_EMBEDDED_URL) {
      const { payload } = JSON.parse(data);
      //dutchie has two properties. playload an payload.
      switch (payload.event) {
        case DUTCHIE_addProduct:
          const [item] = payload.payload;
          const { quantity, variant } = item;
          const fraction = variant.replace(/oz/, '');
          const delta = fractionToNumber(fraction) * quantity;

          const uid = auth.currentUser?.uid;
          const ordersRef = ref(db, `orders/${uid}/amountAllowed`);


          set(ordersRef, this.state.orders.amountAllowed - delta
          ).then((v) => {
            console.log(v);
          })

          break;
        case DUTCHIE_removeProduct:{
          const [item] = payload.payload;
          const { quantity, variant } = item;
          const fraction = variant.replace(/oz/, '');
          const delta = fractionToNumber(fraction) * quantity;

          const uid = auth.currentUser?.uid;
          const ordersRef = ref(db, `orders/${uid}/amountAllowed`);

          set(ordersRef, this.state.orders.amountAllowed + delta
            ).then((v) => {
              console.log(v);
            })
          }
          break;
        case 'route:changed':

          break;
        default:
          
          break;
      }
    }


  }


  componentDidMount() {
    window.addEventListener('message', this.onDutchieMessage);


    this.fetchData();
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
 
    this.setState({orders});
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
            max="2.5"
            value={amountAllowed}
          />
        </div>
        <div className='iframe--store'>
          <iframe id='iframe-store' title='iframe-store' src="https://dutchie.com/embedded-menu/curaleaf-fl-st-petersburg/products/flower?">
            NO IFRAMES
          </iframe>
        </div>
      </section>
    );
  }
}
