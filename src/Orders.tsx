import * as React from "react";

interface IOrderFLState {
  DateCreated: string;
  DurationDays: any;
  EndDate: string;
  OrderId: number;
  OrderStatus: string;
  OrderType: string;
  PatientId: number;
  StartDate: string;
  StatusId: number;
  TypeId: number;
  amountRemaining: string;
  dispensableAmount: string;
}

//dispensed property
//remaining property

export default class Order extends React.Component<any, IOrderFLState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="order--info">
        <div></div>

        <div className="iframe--store">
          {/* <iframe
            id="iframe-store"
            title="iframe-store"
            src="https://dutchie.com/embedded-menu/curaleaf-fl-st-petersburg/products/flower?"
          >
            NO IFRAMES
          </iframe> */}
        </div>
      </div>
    );
  }
}
