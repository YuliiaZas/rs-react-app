import { FC } from 'react';
import { KeyValuePair } from '@utils';
import styles from './card-small.module.css';

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
              <span className={styles.value}>{item.value}</span>
              {i !== arr.length - 1 && '; '}
            </span>
          );
        })}
        .
      </p>
    </div>
  );
};
