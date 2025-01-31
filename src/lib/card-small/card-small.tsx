import { Component } from 'react';
import { KeyValuePair } from '../../utils/key-value-pair.type';
import './card-small.css';

interface CardSmallProps {
  cardTitle: string;
  listOfDetails: KeyValuePair[];
}

class CardSmall extends Component<CardSmallProps> {
  getDescriptionItems(): JSX.Element[] {
    return this.props.listOfDetails.map((item, i, arr) => {
      return (
        <span className="small-card-detail" key={item.key}>
          <span className="small-card-detail-key">{item.key}: </span>
          <span className="small-card-detail-value">{item.value}</span>
          {i !== arr.length - 1 && '; '}
        </span>
      );
    });
  }

  render() {
    return (
      <div>
        <h3>{this.props.cardTitle}</h3>
        <p className="small-card-detail">{this.getDescriptionItems()}.</p>
      </div>
    );
  }
}

export default CardSmall;
