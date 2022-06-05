import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getDatabase, onValue, ref, set } from '@firebase/database';
import * as React from 'react';
import { ChangeEvent } from 'react';
import BubbleDisplay from './BubbleDisplay';
import config from './config';

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase();
let amount= 0.0;



export default class Orders extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { amountAllowed:0  };
    this.setAmountAllowed = this.setAmountAllowed.bind(this);
    this.syncAmounts = this.syncAmounts.bind(this);


  }

  componentDidMount(){
    
    const userRef = ref(db, `users/${auth.currentUser?.uid}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      this.setState({amountAllowed: data.amountAllowed});
      console.log(this.state.amountAllowed);
    })
  }


  setAmountAllowed(e: ChangeEvent<{value:string}>) {
    const {value} = e.currentTarget;
    this.setState({ amountAllowed:value  });
    console.log(this.state.amountAllowed
      )
  }


  syncAmounts() {
    console.log('syncing...');
    set(ref(db, `users/${auth.currentUser?.uid}`), {
      uploadDate: new Date().toUTCString(),
      amountAllowed: this.state.amountAllowed,
    }).then((v)=>{
      console.log(v);
    })
  }

  render() {

    return (
      <section>
        <div className="order--info">
          <BubbleDisplay
            available={this.state.amountAllowed}
            max={2.5}
            displayLabel={this.state?.type}
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
