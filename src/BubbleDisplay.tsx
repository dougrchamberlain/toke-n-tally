import * as React from "react";
import { fractionToNumber } from "./config";
import {getAuth} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {collection, setDoc, getFirestore} from 'firebase/firestore'

interface FillsInformation {
  DateCreated: string;
  DurationDays: number;
  EndDate: string;
  OrderType: string;
  StartDate: string;
  amountRemaining: string;
  dispensableAmount: string;
}

class BubbleDisplay extends React.Component<FillsInformation> {
  renderProgressBar() {
    debugger;
    const dispensableAmount = this.props.dispensableAmount.split("/")[0];
    const decimalAmount = fractionToNumber(dispensableAmount);

    var percent = (decimalAmount / 2.5) * 100;
    return (
      <div className="BubbleDisplay--container">
        <label className="product--type">{"displayLabel"}</label>
        <div className="progress">
          <div
            style={{
              width: `${percent}%`,
            }}
          >
            <div className="overlay-progress">
              <div className="overlay--labels">
                <label className="fractional--display">
                  {decimalAmount}/{2.5}oz
                </label>
                <label className="text--overlay">{"percent"}%</label>
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="reupDate">date</label>
      </div>
    );
  }

  render() {
    return this.renderProgressBar();
  }
}

export default BubbleDisplay;
