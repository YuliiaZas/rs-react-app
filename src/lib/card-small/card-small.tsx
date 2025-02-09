import { FC } from 'react';
import { KeyValuePair } from '@utils';
import './card-small.css';

interface CardSmallProps {
  cardTitle: string;
  listOfDetails: KeyValuePair[];
}

export const CardSmall: FC<CardSmallProps> = ({ cardTitle, listOfDetails }) => {
  return (
    <div>
      <h3>{cardTitle}</h3>
      <p className="small-card-detail">
        {listOfDetails.map((item, i, arr) => {
          return (
            <span className="small-card-detail" key={item.key}>
              <span className="small-card-detail-key">{item.key}: </span>
              <span className="small-card-detail-value">{item.value}</span>
              {i !== arr.length - 1 && '; '}
            </span>
          );
        })}
        .
      </p>
    </div>
  );
};
