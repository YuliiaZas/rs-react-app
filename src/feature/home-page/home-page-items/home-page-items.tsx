import { Component } from 'react';
import { CardSmall } from '@lib';
import { KeyValuePair, People } from '@utils';

interface HomePageItemsProps {
  title: string;
  items: People[];
}

export class HomePageItems extends Component<HomePageItemsProps> {
  emptyResult = "Sorry, we couldn't find anything. Please check your request.";

  getItemslist(): JSX.Element[] {
    return this.props.items.map((item) => {
      return (
        <li key={item.name}>
          <CardSmall
            cardTitle={item.name}
            listOfDetails={this.getListOfDetails(item)}
          />
        </li>
      );
    });
  }

  getListOfDetails(item: People): KeyValuePair[] {
    const { gender, birth_year: year, height, mass } = item;
    return [
      { key: 'Gender', value: gender },
      { key: 'Year of birth', value: year },
      { key: 'Height', value: height },
      { key: 'Mass', value: mass },
    ];
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <div>
          {this.props.items.length ? (
            <ul>{this.getItemslist()}</ul>
          ) : (
            <p>{this.emptyResult}</p>
          )}
        </div>
      </div>
    );
  }
}
