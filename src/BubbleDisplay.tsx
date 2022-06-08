
import * as React from 'react';

interface amount {
  available: number;
  max: number;
  displayLabel: string;
  reupDate: string;
}

class BubbleDisplay extends React.Component<amount, any> {

  renderProgressBar() {
    const { available: remaining, max, displayLabel, reupDate } = this.props;
    var percent = (remaining / max) * 100;
    return (
      <div className="BubbleDisplay--container">
        <label className='product--type'>{displayLabel}</label>
        <div className="progress">
          <div
            style={{
              width: `${percent}%`,
            }}
          >
            <div className="overlay-progress">
              <div className="overlay--labels">
                <label className='fractional--display'>{remaining}/{max}oz</label>
                <label className="text--overlay">
                  {percent.toFixed(2)}%
                </label>
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="reupDate">
          {reupDate ? 'Amount set to increase after ' + reupDate : ''}
        </label>
      </div>
    );
  }

  render() {
    return this.renderProgressBar();
  }
}

export default BubbleDisplay;
