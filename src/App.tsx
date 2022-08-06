import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getDatabase } from "@firebase/database";
import * as React from "react";
import {
  config,
  DUTCHIE_addProduct,
  DUTCHIE_EMBEDDED_URL,
  DUTCHIE_removeProduct,
  fractionToNumber,
} from "./config";
import Order from "./Orders";
import "./style.css";

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase(app);

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.onDutchieMessage = this.onDutchieMessage.bind(this);
    this.syncAmounts = this.syncAmounts.bind(this);
  }

  onDutchieMessage(event: MessageEvent) {
    if (event.origin === DUTCHIE_EMBEDDED_URL) {
      const dataObject = JSON.parse(event.data);

      if (dataObject.event !== "analytics:dataLayer") {
        return;
      }
      //dutchie has two properties. playload an payload.
      const {
        payload,
        payload: { ecommerce },
      } = dataObject.payload;

      if (!ecommerce) {
        return;
      }

      const [item] = ecommerce.items;

      const { item_variant, quantity } = item;
      const fraction = item_variant.replace(/oz/, "");

      const delta = fractionToNumber(fraction) * quantity;

      let newAmount: number = 0;
      const { amountAllowed } = this.state;

      switch (payload.event) {
        case DUTCHIE_addProduct:
          newAmount = amountAllowed - delta;
          break;
        case DUTCHIE_removeProduct:
          newAmount = amountAllowed + delta;
          break;
      }
      this.syncAmounts();
      this.setState({ amountAllowed: newAmount });
    }
  }

  componentDidMount() {
    window.addEventListener("message", this.onDutchieMessage);
    this.getUserOrders();
  }

  render() {
    return (
      <div className="appContainer">
        <nav>
          <h1>Toke-N-Tally</h1>
          <menu type="toolbar"></menu>
        </nav>
        <Order />
      </div>
    );
  }

  syncAmounts() {
    // const uid = auth.currentUser?.uid;
    // const ordersRef = ref(db, `orders/${uid}/amountAllowed`);
    // set(ordersRef, this.state.amountAllowed).then((v) => {
    //   //do anything here that depends on
    //   console.log("pushed to cloud...");
    // });
  }

  async getUserOrders() {
    const tab = await chrome.tabs.getCurrent();
    const id = tab.id || chrome.tabs.TAB_ID_NONE;
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        chrome.tabs.sendMessage(
          id,
          {
            status: "sync",
          },
          function (response) {
            console.log(response);
          }
        );
      }
    );

    chrome.runtime.onMessage.addListener(function (
      { payload },
      sender,
      sendResponse
    ) {
      sendResponse({ status: "uploaded" });

      return <pre>{payload}</pre>;
    });
  }
}
